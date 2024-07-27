import { OpenAI } from "openai";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'))

const SYSTEM_PROMPT = `You are a city employee that works with the community to identify problems your 311 service can solve.
The user is a community member who has submitted an image of a problem in their neighborhood. Your job is to describe the image
in two sentences. Provide reasoning why a particular ProblemCategory is the most specific category applicable to the image, and then
provide the catgeory. If you are unsure of the category, you can ask the user for more information. Choose the most specific category
applicable. If the image does not contain a problem, please respond with "No Problem Identified".

type ProblemCategory = 'Abandoned or Inoperable Vehicle (Private Property Only)'|'Address Validation'|'Alley Maintenance'|'Bad Odor Complaint (Sewer Only)'|
  'Bagged Yard Waste'|'Brush Collection'|'Bulk Trash'|'Constituent Service Request'|'Contractor Complaint'|'Damage by City Crew'|
  'Dead Animal Pickup'|'Distressed Pavement'|'Documentation Only'|'Driver Call In'|'Driver Safety Complaint'|'Driveway'|'Erosion and Drainage'|
  'Erosion, Drainage on a Construction Site'|'Feedback and Questions'|'Flashing Beacons'|'Flooding'|'Garbage and Recycling Assistance'|
  'Garbage Container Removal'|'Garbage container repair'|'Graffiti Removal'|'Grinder Pump Station Repair'|'Guardrail Request or Repair'|
  'Housing Violations'|'Illegal Dumping'|'Inquiry on closed service request'|'Litter - On Roadside and Sidewalks (paper, small items etc)'|
  'Litter - Private Property'|'Loose Leaf Collection'|'Manhole Cover'|'Manhole Problem'|'Miscellaneous Facilities Maintenance Requests'|
  'Missed Garbage'|'Missed Recycle'|'New Garbage Container'|'Non Traceable Illegal Dumping (Internal)'|'Overgrowth Private Property'|
  'Park Reservations'|'Potholes'|'Public Park Work Request'|'Recycle Container Removal'|'Roadside Mowing'|'Roadway Sight Obstruction'|
  'Sewer Backup'|'Sewer Billing (Shelly) Refund/Adjustment/Credit'|'Sewer Disc/Rec Review'|'Short Term Work Order - Traffic Operations'|
  'Sidewalks'|'Size Driveway Pipe/Tile'|'Steel/Metal Plates in Roadway'|'Storm Drainage Problems'|'Storm Drainage Violation (Leaves)'|
  'Storm Grates'|'Street Cleanup'|'Street Lane Markings'|'Street Lights (not Traffic Signals)'|'Street Sweeping'|'Sunken Surface Area'|
  'Supervisor Call Back'|'Surplus Property Pick-up Request'|'Temporary Roadway Closure for Events, Work, or Private Use'|'Tires - Roadside'|
  'Traffic Calming'|'Traffic Control for Work Zone'|'Traffic Signals'|'Traffic Signs'|'Tree Fallen/Branch'|'Tree Problem'|'Tree Removal'|
  'Tree Trimming'|'Veterans Bridge Flag Maintenance'|'Water Pollution'|'Zoning Violations'|'No Problem Identified';
  
type Response = {
  short_description: string,
  reasoning: string,
  category: ProblemCategory
}

Respond only in JSON that conforms to the Response type.
`;

app.get("/", (req: Request, res: Response) => {
  res.send("server ok");
});

app.get("/describe", async (req: Request, res: Response) => {
  const  { url } = req.query;
  if (!url) {
    return res.status(400).send("image url parameter is required");
  }

  console.log("URL:", url)

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "user", content: [
          { type: "text", text: "Please describe the contents of the image below" },
          { type: "image_url", image_url: {
              url: url as string
            }
          }
        ] },
        { role: "system", content: SYSTEM_PROMPT},
      ],
      response_format: { type: "json_object" },
      max_tokens: 256,
    });

    res.send(JSON.parse(response.choices[0].message.content || "{}"));
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/upload", express.raw({ inflate: true, limit: '50mb', type: () => true }), async (req: Request, res: Response) => {
  if (!req.body || !req.body.length) {
    return res.status(400).send("imageData parameter is required");
  }

  console.log("Length:", req.body.length);
  const dataStart = req.body.toString('utf-8').indexOf('data:image');
  console.log("DATA:",req.body.toString('utf-8').substring(dataStart, dataStart + 100));
  // res.send("ok")
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "user", content: [
          { type: "text", text: "Please describe the contents of the image below" },
          { type: "image_url", image_url: {
              url: req.body.toString('utf-8').substring(dataStart)
            }
          }
        ] },
        { role: "system", content: SYSTEM_PROMPT},
      ],
      response_format: { type: "json_object" },
      max_tokens: 256,
    });

    const data = response.choices[0].message.content;
    const parsed = JSON.parse(data || "{}")
    console.log("RESPONSE:", data)

    res.send(parsed);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});