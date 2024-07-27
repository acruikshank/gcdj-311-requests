function sendFile(fileData) {
	var formData = new FormData();

	formData.append('imageData', fileData);

  fetch('/upload', {
    method: 'POST',
    body: formData
  }).then((response) => response.json())
    .then((data) => {
      const div = document.createElement('div');
      div.setAttribute('class', 'text-message');
      div.innerHTML = `Thanks for sending us this image. This is what I'm seeing. ${data.reasoning} We're on it! category: ${data.category}.`;
      try {
        const messages = document.querySelector('.messages')
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
      } catch (e) {
        console.error(e)
      }
    })
  .catch((e) => {
    alert('There was an error uploading your file! ' + e);
  });
}

function processFile(dataURL, fileType) {
  console.log("File Type: ", fileType)
	var maxWidth = 800;
	var maxHeight = 800;

	var image = new Image();
	image.src = dataURL;

	image.onload = function () {
		var width = image.width;
		var height = image.height;
		var shouldResize = (width > maxWidth) || (height > maxHeight);

		if (!shouldResize) {
			sendFile(dataURL);
			return;
		}

		var newWidth;
		var newHeight;

		if (width > height) {
			newHeight = height * (maxWidth / width);
			newWidth = maxWidth;
		} else {
			newWidth = width * (maxHeight / height);
			newHeight = maxHeight;
		}

		var canvas = document.createElement('canvas');

		canvas.width = newWidth;
		canvas.height = newHeight;

    canvas.setAttribute('class', 'image-message')

    const messages = document.querySelector('.messages')
    messages.appendChild(canvas);
    messages.scrollTop = messages.scrollHeight;

		var context = canvas.getContext('2d');    

		context.drawImage(this, 0, 0, newWidth, newHeight);

		dataURL = canvas.toDataURL(fileType);

		sendFile(dataURL);
	};

	image.onerror = function () {
		alert('There was an error processing your file!');
	};
}

function readFile(file) {
	var reader = new FileReader();

	reader.onloadend = function () {
		processFile(reader.result, file.type);
	}

	reader.onerror = function () {
		alert('There was an error reading the file!');
	}

	reader.readAsDataURL(file);
}

if (window.File && window.FileReader && window.FormData) {
	var inputField = document.getElementById('file');

	inputField.onchange = (e) => {
		var file = e.target.files[0];

		if (file) {
			if (/^image\//i.test(file.type)) {
				readFile(file);
			} else {
				alert('Not a valid image!');
			}
		}
	};
} else {
	alert("File upload is not supported!");
}