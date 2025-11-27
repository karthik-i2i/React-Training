import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: 'https://691593e584e8bd126afa792e.mockapi.io/todo/'}),
    tagTypes: ['User', 'Task'],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => 'todo-users',
            providesTags: ['User']
        }),
        getUserByEmail: builder.mutation({
          query: (email) => `todo-users?email=${email}`
        }),
        getUserById: builder.query({
          query: (id) => `todo-users/${id}`,
          providesTags: ['User']
        }),
        addUser: builder.mutation({
            query: (newUser) => ({
                url: 'todo-users',
                method: 'POST',
                body: newUser
            }),
            invalidatesTags: ['User']
        }),
        updateUser: builder.mutation({
          query: ({ id, ...updatedUser }) => ({
            url: `todo-users/${id}`,
            method: "PUT",
            body: updatedUser,
          }),
          invalidatesTags: ["User"],
        }), 
        updateUserTasks: builder.mutation({
          query: ({ id, taskList }) => ({
            url: `todo-users/${id}`,
            method: "PUT",
            body: { taskList },
          }),
          invalidatesTags: ["User"],
        }),
        getTasks: builder.query({
          query: () => 'todo-tasks',
          providesTags: ['Task']
        }),
        getTasksByAssignee: builder.query({
          query: (assigneeId) => `todo-tasks?assigneeId=${assigneeId}`,
          providesTags: ['Task']
        }),

        addTask: builder.mutation({
          query: (task) => ({
            url: 'todo-tasks',
            method: 'POST',
            body: task
          }),
          invalidatesTags: ['Task']
        }),

        updateTask: builder.mutation({
          query: ({ id, ...updated }) => ({
            url: `todo-tasks/${id}`,
            method: 'PUT',
            body: updated
          }),
          invalidatesTags: ['Task']
        }),

        deleteTask: builder.mutation({
          query: (id) => ({
            url: `todo-tasks/${id}`,
            method: 'DELETE'
          }),
          invalidatesTags: ['Task']
        }),
    })
});

export const { useGetUsersQuery, useGetUserByEmailMutation, useAddUserMutation, useUpdateUserMutation, useUpdateUserTasksMutation, 
  useGetUserByIdQuery, useGetTasksQuery, useGetTasksByAssigneeQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation, } = apiSlice;

