import { redirect } from 'next/navigation';

export default function SuperAdminAllUsersRedirect() {
  redirect('/super-admin/users');
}
