import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: 'https://691593e584e8bd126afa792e.mockapi.io/todo/'}),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => 'todo-users',
            providesTags: ['User']
        }),
        getUserByEmail: builder.mutation({
          query: (email) => `todo-users?email=${email}`
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
    })
});

export const { useGetUsersQuery, useGetUserByEmailMutation, useAddUserMutation, useUpdateUserMutation, useUpdateUserTasksMutation } = apiSlice;

