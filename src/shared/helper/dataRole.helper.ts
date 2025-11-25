export const dictRoleMain: Record<string, string[]> = {
    'admin-server': [
        "song_view", "song_create", "song_edit", "song_delete",
        "manager_view", "manager_create", "manager_edit", "manager_delete",
        "topic_view", "topic_create", "topic_edit", "topic_delete",
        "role_view", "role_create", "role_edit", "role_delete",
        "user_view", "user_create", "user_edit", "user_delete",
        "singer_view", "singer_create", "singer_edit", "singer_delete"
    ],
    'admin-user': [
        "user_view", "user_create", "user_edit", "user_delete"
    ],
    'admin-manager': [
        "manager_view", "manager_create", "manager_edit", "manager_delete"
    ],
    'admin-singer': [
        "singer_view", "singer_create", "singer_edit", "singer_delete"
    ],
    'admin-role': [
        "role_view", "role_create", "role_edit", "role_delete"
    ]
};