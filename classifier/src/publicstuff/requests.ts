
interface Filters {
    [key: string]: string | number | boolean;
  }
  
  interface RequestQueryParameters {
    page?: number;
    limit?: number;
    Authorization: string;
    PublicStuff_Session_Token?: string;
    ids?: number[] | number;
    not_ids?: number[] | number;
    since?: string;
    after?: string;
    before?: string;
    sort_key?: string;
    sort_dir?: string;
    filters?: Filters;
    date_column?: string;
    in_day?: string;
    in_week?: string;
    in_month?: string;
    in_year?: string;
    field_only?: string[];
    field_extras?: string[];
    timezone?: string;
    client_ids?: number[] | number;
    object_field_ids?: number[] | number;
    request_type_group?: number[] | number;
    reported_by?: (number | string)[] | number | string;
    created_by?: (number | string)[] | number | string;
    completed_by?: (number | string)[] | number | string;
    followed_by?: (number | string)[] | number | string;
    commented_by?: (number | string)[] | number | string;
    managed_by?: (number | string)[] | number | string;
    assigned_to?: (number | string)[] | number | string;
    not_assigned?: boolean;
    is_open?: boolean;
    is_closed?: boolean;
    is_unresponded?: boolean;
    is_responded?: boolean;
    has_due_at?: boolean;
    has_expected_responded_at?: boolean;
    with_request_type_default_duration_s?: boolean;
    with_request_type_default_response_s?: boolean;
    is_public?: boolean;
    is_internal?: boolean;
    is_overdue?: boolean;
    is_due_soon?: boolean;
    due_status?: string[] | string;
    due_before?: number;
    due_after?: number;
    has_comments?: boolean;
    has_attachments?: boolean;
    has_duplicates?: boolean;
    has_object_fields?: boolean;
    tags?: string[] | string;
    ratings?: string[] | string;
    comment_contains?: string[] | string;
    object_field_filter?: { [key: string]: any };
    has_foreign_ids?: boolean;
    with_foreign_integration_id?: number;
    with_foreign_integration_instance_id?: number;
    within_region_id?: number[] | number;
    within_geo_data_id?: number[] | number;
    nw_lat?: number;
    nw_lon?: number;
    se_lat?: number;
    se_lon?: number;
    lat?: number;
    lon?: number;
    radius?: number;
  }
  
  interface CreateRequestParameters {
    Authorization: string;
    PublicStuff_Session_Token?: string;
    request_name?: string;
    request_description?: string;
    request_id?: number;
    request_request_type_id?: number;
    request_creator_id?: number;
    request_workflow_node_id?: number;
    request_status?: string;
    request_api_source_id?: number;
    request_priority?: string;
    request_geo_location_id?: number;
    request_locale_origin?: string;
    request_workflow_graph_id?: number;
    request_primary_attachment_id?: number;
    request_reporter_id?: number;
    request_attachments_count?: number;
    request_flags_count?: number;
    request_follows_count?: number;
    request_comments_count?: number;
    request_tags_count?: number;
    request_display_foreign_id?: boolean;
    request_average_rating?: number;
    request_ratings_count?: number;
    request_use_permission_matrix?: boolean;
    request_permissions_poro?: { [key: string]: any };
    request_contact_info_first_name?: string;
    request_contact_info_last_name?: string;
    request_contact_info_email?: string;
    request_contact_info_phone?: string;
    request_contact_info_username?: string;
    request_contact_info_user_id?: number;
    request_foreign_associations_count?: number;
    request_completion_time_s?: number;
    request_expected_completion_time_s?: number;
    request_response_time_s?: number;
    request_expected_response_time_s?: number;
    request_client_id?: number;
  }
  
  interface UpdateRequestParameters {
    Authorization: string;
    PublicStuff_Session_Token?: string;
    request_name?: string;
    request_description?: string;
    request_id?: number;
    request_request_type_id?: number;
    request_creator_id?: number;
    request_workflow_node_id?: number;
    request_status?: string;
    request_api_source_id?: number;
    request_priority?: string;
    request_geo_location_id?: number;
    request_locale_origin?: string;
    request_workflow_graph_id?: number;
    request_primary_attachment_id?: number;
    request_reporter_id?: number;
    request_attachments_count?: number;
    request_flags_count?: number;
    request_follows_count?: number;
    request_comments_count?: number;
    request_tags_count?: number;
    request_display_foreign_id?: boolean;
    request_average_rating?: number;
    request_ratings_count?: number;
    request_use_permission_matrix?: boolean;
    request_permissions_poro?: { [key: string]: any };
    request_contact_info_first_name?: string;
    request_contact_info_last_name?: string;
    request_contact_info_email?: string;
    request_contact_info_phone?: string;
    request_contact_info_username?: string;
    request_contact_info_user_id?: number;
    request_foreign_associations_count?: number;
    request_completion_time_s?: number;
    request_expected_completion_time_s?: number;
    request_response_time_s?: number;
    request_expected_response_time_s?: number;
    request_client_id?: number;
  }
  
  interface DeleteRequestParameters {
    Authorization: string;
    PublicStuff_Session_Token?: string;
  }
  