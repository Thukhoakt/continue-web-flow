-- Add admin role for the current user
INSERT INTO public.user_roles (user_id, role)
VALUES ('8948fe55-9e50-4c5f-9d2d-fa56bb3fd5a5', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;