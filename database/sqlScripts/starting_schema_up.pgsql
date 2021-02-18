CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE IF NOT EXISTS public.d3l_user(
    created_at timestamptz NOT NULL default NOW(),
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    first_name text,
    middle_name text,
    last_name text,
    email text NOT NULL,
    password text NOT NULL,
    phone text,
    address text
);

CREATE TABLE IF NOT EXISTS public.d3l_course(
    created_at timestamptz NOT NULL default NOW(),
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    title text NOT NULL,
    course_prefix text NOT NULL,
    course_number text NOT NULL,
    section_number text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.d3l_team(
    created_at timestamptz NOT NULL default NOW(),
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    team_name text NOT NULL,
    course_id BIGINT,
    CONSTRAINT fk_course
		FOREIGN KEY(course_id) 
			REFERENCES public.d3l_course(id)
);

CREATE TABLE IF NOT EXISTS public.d3l_content(
    created_at timestamptz NOT NULL default NOW(),
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    course_id BIGINT,
    title text NOT NULL,
    body text,
    file_url text,
    is_graded BOOLEAN,
    CONSTRAINT fk_course
        FOREIGN KEY(course_id)
            REFERENCES public.d3l_course(id)
);

CREATE TABLE IF NOT EXISTS public.d3l_user_content(
    created_at timestamptz NOT NULL default NOW(),
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    course_id BIGINT,
    user_id BIGINT,
    points_earned numeric(6,3),
    points_total numeric(6,3),
    CONSTRAINT fk_course
        FOREIGN KEY(course_id)
            REFERENCES public.d3l_course(id),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES public.d3l_user(id)
);

CREATE TABLE IF NOT EXISTS public.d3l_discussion_post(
    created_at timestamptz NOT NULL default NOW(),
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    user_id BIGINT,
    course_id BIGINT,
    parent_id BIGINT,
    content_id BIGINT,
    title text NOT NULL,
    body text,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES public.d3l_user(id),
    CONSTRAINT fk_content
        FOREIGN KEY(content_id)
            REFERENCES public.d3l_content(id),
    CONSTRAINT fk_course
        FOREIGN KEY(course_id)
            REFERENCES public.d3l_course(id),
    CONSTRAINT fk_parent
        FOREIGN KEY(parent_id)
            REFERENCES public.d3l_discussion_post(id),
    CHECK (user_id IS NOT NULL OR course_id IS NOT NULL OR parent_id IS NOT NULL OR content_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS public.d3l_user_team(
    created_at timestamptz NOT NULL default NOW(),
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    user_id BIGINT,
    team_id BIGINT,
    CONSTRAINT fk_user
		FOREIGN KEY(user_id) 
			REFERENCES public.d3l_user(id),
    CONSTRAINT fk_team
		FOREIGN KEY(team_id) 
			REFERENCES public.d3l_team(id)
);

CREATE TABLE IF NOT EXISTS public.d3l_user_course(
    created_at timestamptz NOT NULL default NOW(),
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    user_id BIGINT,
    course_id BIGINT,
    CONSTRAINT fk_user
		FOREIGN KEY(user_id) 
			REFERENCES public.d3l_user(id),
    CONSTRAINT fk_course
		FOREIGN KEY(course_id) 
			REFERENCES public.d3l_course(id)
);

CREATE TABLE IF NOT EXISTS public.d3l_user_role(
    created_at timestamptz NOT NULL default NOW(),
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    user_id BIGINT,
    role text NOT NULL,
    CONSTRAINT fk_user
		FOREIGN KEY(user_id) 
			REFERENCES public.d3l_user(id)
);