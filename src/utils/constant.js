
//We are creating this for models what the roles of user
export const UserRoleEnum={
    Admin:"admin",
    Project_Admin:"project_admin",
    Member:"member"
}
//this provide the value of key value object and we use this in our model
export const AvailableUserRole=Object.values(UserRoleEnum)



export const TaskStatusEnum={
    Todo:"todo",
    In_Progress:"in_progress",
    Done:"done"
}

export const AvailableTaskStatus=Object.values(TaskStatusEnum)