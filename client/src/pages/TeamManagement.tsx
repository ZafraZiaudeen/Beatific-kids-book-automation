import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiRequest } from "@/lib/api";
import type { TeamInvitation, TeamMember } from "@/types/app";
import { useEffect, useState } from "react";

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [emailAddress, setEmailAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTeam = async () => {
    const [membersPayload, invitationsPayload] = await Promise.all([
      apiRequest<TeamMember[]>("/api/team/members"),
      apiRequest<TeamInvitation[]>("/api/team/invitations"),
    ]);
    setMembers(membersPayload);
    setInvitations(invitationsPayload);
  };

  useEffect(() => {
    void loadTeam();
  }, []);

  const submitInvite = async () => {
    setIsSubmitting(true);
    try {
      await apiRequest("/api/team/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailAddress }),
      });
      setEmailAddress("");
      await loadTeam();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <header>
        <h1 className="text-[2.25rem] font-extrabold tracking-[-0.04em] text-[#1d174b] sm:text-[2.8rem]">
          Team Management
        </h1>
        <p className="mt-1 text-[0.98rem] text-[#7b7399]">
          Admin-only access for inviting collaborators and reviewing membership.
        </p>
      </header>

      <Card className="mt-6 border-[#ebe5f8] bg-white/88">
        <CardHeader>
          <CardTitle>Invite a new member</CardTitle>
          <CardDescription>Invited users join as members by default.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={emailAddress}
            onChange={(event) => setEmailAddress(event.target.value)}
            placeholder="member@example.com"
          />
          <Button onClick={() => void submitInvite()} disabled={!emailAddress || isSubmitting}>
            Send invite
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card className="border-[#ebe5f8] bg-white/88">
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.fullName}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell className="capitalize">{member.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-[#ebe5f8] bg-white/88">
          <CardHeader>
            <CardTitle>Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell>{invitation.emailAddress}</TableCell>
                    <TableCell className="capitalize">{invitation.status}</TableCell>
                    <TableCell>{formatDate(invitation.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function formatDate(value: number) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}
