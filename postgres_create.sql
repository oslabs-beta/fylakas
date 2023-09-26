CREATE TABLE public.users (
  "user_id" serial NOT NULL,
  "username" text NOT NULL,
  "password" text NOT NULL,
  "hash_id" text,
  CONSTRAINT "user_pk" PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.clusters (
  "cluster_id" serial NOT NULL,
  "user_id" serial NOT NULL REFERENCES public.users(user_id),
  "prom_url" text NOT NULL,
  CONSTRAINT "clusters_pk" PRIMARY KEY ("cluster_id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE public.clusters ADD CONSTRAINT "users_fk0" FOREIGN KEY ("user_id") REFERENCES public.users("user_id");