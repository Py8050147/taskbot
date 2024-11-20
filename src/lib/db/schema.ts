import { sql } from "drizzle-orm";
import { integer, pgTable, serial, text,  timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    fname: varchar('fname', { length: 100 }).notNull(),
    lname: varchar('lname', { length: 100 }).notNull(),
    email: varchar('email', { length: 100 }).notNull(),
    password: varchar('password', { length: 100 }).notNull(),
    image: text('image'),
    role: varchar('role', { length: 12 }).notNull().default('student'), 
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`)
})


export const teams = pgTable('teams', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`)
})

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 500 }).notNull(),
    description: text('description'),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).notNull(),
    teamId: integer('team_id').notNull().references(() => teams.id, { onDelete: 'no action' }).notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date'),
    status: varchar('status', { length: 10 }).notNull().default('Archived'),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`)
})

export enum Status {
    ToDo = "To-Do",
    InProgress = "In Progress",
    Completed = "Completed",
}

export enum Priority {
    Low = "Low",
    Medium = "Medium",
    High = "High",
}


export const tasks = pgTable('tasks', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 500 }).notNull(),
    description: text('description'),
    projectid: integer('project_id').notNull().references(() => projects.id,  {
      onDelete: 'set null'
    }).notNull(),
    userId: integer('user_id').notNull().references(() => users.id,  {
        onDelete: 'cascade'
    }).notNull(),
    status: varchar("status", { length: 20 }).$type<Status>().notNull(), // Enum enforced at TypeScript level
    priority: varchar("priority", { length: 10 }).$type<Priority>().notNull(), // Enum enforced at TypeScript level
    dueDate: timestamp('due_date'),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`)
})

export const comments = pgTable('comments', {
    id: serial('id').primaryKey(),
    taskId: integer('task_id').notNull().references(() => tasks.id, {
        onDelete: 'set null'
    }).notNull(),
    userId: integer('user_id').notNull().references(() => users.id,  {
        onDelete: 'cascade'
    }).notNull(),
    text: varchar('text', { length: 500 }),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`)
})

export const attachments = pgTable('attachments', {
    id: serial('id').primaryKey(),
    taskId: integer('task_id').notNull().references(() => tasks.id, {
        onDelete: 'set null'
    }).notNull(),
    fileName: varchar('fileName', { length: 500 }).notNull(),
    fileUrl: text('file_url').notNull(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`)
})