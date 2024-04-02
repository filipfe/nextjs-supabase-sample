## Setting up magic link auth

#### Turn off confirmation

In your Supabase dashboard navigate to _Authentication -> Providers -> Email_. Turn off the _Confirm email_ switch. This prevents double email when user signs up for the first time through magic link.

#### Configure email template

In your Supabase dashboard navigate to _Authentication -> Email Templates_.

**Switch to _Magic Link_ tab**.

Change URL inside the href tag to

```bash
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink
```

#### (Optional) Configure custom SMTP provider to prevent rate limits

In your Supabase dashboard navigate to _Project Settings -> Authentication_. Scroll down to _SMTP Settings_ section and configure your custom SMTP provider.

Then, in your Supabase dashboard, navigate to _Authentication -> Rate Limits_. Change _Rate limit for sending emails_ option to a higher value.

## Schedule account deletion

Add a new column to the public.profiles table called _deletion_date_ with a type of _date_

### Handle deletion

#### Access policy on profiles

Create a policy for public.profiles table allowing users to access and modify data based on their user id:

```bash
create policy "Access based on user id"
on "public"."profiles"
as PERMISSIVE
for ALL
to public
using (
  auth.uid() = id
);
```

#### Updating deletion date

Change the code in _deleteUser_ server action to update the _deletion_date_ column instead of deleting user right away:

```bash
const current = new Date();
const deletion_date = new Date();
deletion_date.setDate(current.getDate() + 10);
const { error } = await supabase
  .from("profiles")
  .update({ deletion_date })
  .eq("id", user.id);
```

#### Handling redirects

Update Supabase middleware at _lib/supabase/middleware.ts_ to properly handle redirecting when user has a deletion date:

```bash
if (user) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("deletion_date")
    .eq("id", user.id)
    .single();
  if (profile?.deletion_date) {
    return request.nextUrl.pathname === "/reactivate"
      ? response
      : NextResponse.redirect(
          new URL(`${request.nextUrl.origin}/reactivate`)
        );
  }
  ...
}
```

#### Enable pg_cron in Supabase extentions

Navigate to _Database -> Extentions_ in your Supabase dashboard.

Enable _pg_cron_ extention

#### Create a cron job for deleting users

```sql
select cron.schedule (
    'users-cleanup', -- name of the cron job
    '0 0 * * *', -- every day at 00:00 AM
    $$ delete from auth.users where id in (
      select id from profiles
      where deletion_date = now()::date
    ) $$
);
```
