import { useState, type ReactNode } from "react";
import {
  Alert, AppShell, Button, Detail, Dialog, EmptyState, Field, Form, Heading, Screen,
  Section, Stat, StatGroup, Table, defineApp, useCollection, useDisplayState, useNav, useParams,
  useRole,
} from "@wso2/prototype-kit";

interface Claim {
  id: string;
  employeeName: string;
  managerName: string;
  date: string;
  amount: string;
  category: string;
  description: string;
  receiptAttached: boolean;
  status: "Pending" | "Approved" | "Rejected";
  rejectionReason?: string;
  exported: boolean;
}

const claims: Claim[] = [
  {
    id: "claim-1042",
    employeeName: "Priya Nair",
    managerName: "Lee Osei",
    date: "2026-09-02",
    amount: "$48.00",
    category: "Travel",
    description: "Taxi to client site",
    receiptAttached: true,
    status: "Pending",
    exported: false,
  },
  {
    id: "claim-1039",
    employeeName: "Omar Haddad",
    managerName: "Lee Osei",
    date: "2026-08-30",
    amount: "$22.00",
    category: "Meals",
    description: "Client lunch",
    receiptAttached: true,
    status: "Pending",
    exported: false,
  },
  {
    id: "claim-1031",
    employeeName: "Priya Nair",
    managerName: "Lee Osei",
    date: "2026-08-20",
    amount: "$64.00",
    category: "Office Supplies",
    description: "Printer cartridges",
    receiptAttached: true,
    status: "Rejected",
    rejectionReason: "Missing itemized receipt",
    exported: false,
  },
  {
    id: "claim-1028",
    employeeName: "Priya Nair",
    managerName: "Lee Osei",
    date: "2026-08-15",
    amount: "$120.00",
    category: "Travel",
    description: "Flight to vendor conference",
    receiptAttached: true,
    status: "Approved",
    exported: false,
  },
  {
    id: "claim-1019",
    employeeName: "Omar Haddad",
    managerName: "Lee Osei",
    date: "2026-07-18",
    amount: "$22.00",
    category: "Meals",
    description: "Team lunch",
    receiptAttached: false,
    status: "Approved",
    exported: true,
  },
  {
    id: "claim-1012",
    employeeName: "Priya Nair",
    managerName: "Lee Osei",
    date: "2026-08-28",
    amount: "$19.50",
    category: "Meals",
    description: "Coffee with partner",
    receiptAttached: false,
    status: "Approved",
    exported: false,
  },
];

const users = {
  Employee: { name: "Priya Nair", email: "priya.nair@acme.example", role: "Employee" },
  Manager: { name: "Lee Osei", email: "lee.osei@acme.example", role: "Manager" },
  PayrollExporter: { name: "Dana Reyes", email: "dana.reyes@acme.example", role: "Finance" },
};

const statusTone: Record<Claim["status"], "warning" | "success" | "error"> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "error",
};

function Shell({ children }: { children: ReactNode }) {
  const role = useRole() as keyof typeof users;
  const user = users[role] ?? users.Employee;
  const nav =
    role === "Manager"
      ? [{ id: "nav.manager-queue", label: "Pending claims", to: "screen.manager-queue" }]
      : role === "PayrollExporter"
        ? [{ id: "nav.finance-export", label: "Payroll export", to: "screen.finance-export" }]
        : [
            { id: "nav.my-claims", label: "My claims", to: "screen.employee-claims" },
            { id: "nav.new-claim", label: "New claim", to: "screen.new-claim" },
          ];
  return (
    <AppShell
      id="shell"
      user={user}
      nav={nav}
      account="screen.account"
      settings="screen.settings"
      signOut="screen.signed-out"
    >
      {children}
    </AppShell>
  );
}

function EmployeeClaims() {
  const state = useDisplayState();
  const all = useCollection<Claim>("claims");
  const mine = state === "state.empty" ? [] : all.items.filter((c) => c.employeeName === "Priya Nair");
  const pending = mine.filter((c) => c.status === "Pending").length;
  const approved = mine.filter((c) => c.status === "Approved").length;
  return (
    <Shell>
      <Heading
        id="heading.my-claims"
        text="My Claims"
        actions={<Button id="btn.new-claim" label="New Claim" emphasis="primary" to="screen.new-claim" />}
      />
      {state === "state.failed" && (
        <Alert id="alert.claims-failed" tone="error" title="Could not load your claims" text="Try again in a few minutes." />
      )}
      <StatGroup>
        <Stat id="stat.pending" label="Pending" value={String(pending)} hint="awaiting a decision" icon="Hourglass" tone="warning" />
        <Stat id="stat.approved" label="Approved" value={String(approved)} hint="this quarter" icon="CircleCheck" tone="success" />
      </StatGroup>
      <Section id="section.my-claims" title="Claims" count={mine.length} subtitle="Your submitted expense claims, most recent first.">
        <Table
          id="table.my-claims"
          columns={["Date", "Category", { label: "Amount", kind: "number" }, { label: "Status", kind: "status" }]}
          rows={mine.map((c) => ({
            id: `claim.${c.id}`,
            cells: [c.date, c.category, c.amount],
            status: { text: c.status, tone: statusTone[c.status] },
            to: "screen.claim-detail",
            params: { claim: c.id },
          }))}
          empty={<EmptyState id="empty.my-claims" title="No claims yet" text="Submit your first expense claim." actions={<Button id="btn.empty-new-claim" label="New Claim" emphasis="primary" to="screen.new-claim" />} />}
        />
      </Section>
    </Shell>
  );
}

function NewClaim() {
  const state = useDisplayState();
  const navigate = useNav();
  const all = useCollection<Claim>("claims");
  const [category, setCategory] = useState("Meals");
  return (
    <Shell>
      <Heading id="heading.new-claim" text="New Claim" />
      <Section id="section.new-claim" title="Expense details" subtitle="A receipt is required for claims over $25.">
        <Form
          id="form.new-claim"
          onSubmit={(values) => {
            all.create({
              employeeName: "Priya Nair",
              managerName: "Lee Osei",
              date: values.date ?? "2026-09-10",
              amount: values.amount ? `$${values.amount}` : "$0.00",
              category: values.category ?? category,
              description: values.description ?? "",
              receiptAttached: false,
              status: "Pending",
              exported: false,
            });
            navigate.go("screen.employee-claims");
          }}
          actions={
            <>
              <Button id="btn.cancel-new-claim" label="Cancel" to="screen.employee-claims" />
              <Button id="btn.submit-claim" label="Submit Claim" emphasis="primary" submit />
            </>
          }
        >
          <Field id="field.date" name="date" label="Expense date" type="date" required defaultValue="2026-09-10" />
          <Field id="field.amount" name="amount" label="Amount" type="number" required />
          <Field id="field.description" name="description" label="Description" type="textarea" required placeholder="What was this expense for?" />
          <Alert id="alert.suggested-category" tone="info" title="Suggested category: Meals" text="Based on your description, this looks like a meal expense. Change it below if it's wrong." />
          <Field
            id="field.category"
            name="category"
            label="Category"
            type="select"
            options={["Travel", "Meals", "Lodging", "Office Supplies", "Other"]}
            value={category}
            onChange={setCategory}
          />
          <Field
            id="field.receipt"
            name="receipt"
            label="Receipt (required above $25)"
            error={state === "state.validation-error" ? "A receipt is required for claims over $25" : undefined}
          />
        </Form>
      </Section>
    </Shell>
  );
}

function ClaimDetail() {
  const { claim: id } = useParams();
  const navigate = useNav();
  const all = useCollection<Claim>("claims");
  const claim = (id ? all.get(id) : undefined) ?? all.items[0]!;
  const pending = claim.status === "Pending";
  return (
    <Shell>
      <Heading id="heading.claim-detail" text={`Claim — ${claim.category}`} />
      <Detail
        id="detail.claim"
        fields={[
          { label: "Date", value: claim.date },
          { label: "Category", value: claim.category },
          { label: "Amount", value: claim.amount },
          { label: "Description", value: claim.description },
          { label: "Receipt", value: claim.receiptAttached ? "Attached" : "Not required" },
          { label: "Status", value: claim.status },
          ...(claim.rejectionReason ? [{ label: "Rejection reason", value: claim.rejectionReason }] : []),
        ]}
      />
      {pending ? (
        <>
          <Form
            id="form.edit-claim"
            title="Edit claim"
            onSubmit={(values) => {
              all.update(claim.id, { amount: values.amount ? `$${values.amount}` : claim.amount });
              navigate.go("screen.employee-claims");
            }}
            actions={<Button id="btn.save-claim" label="Save Changes" emphasis="primary" submit />}
          >
            <Field id="field.edit-amount" name="amount" label="Amount" type="number" defaultValue={claim.amount.replace("$", "")} />
          </Form>
          <Button
            id="btn.withdraw-claim"
            label="Withdraw Claim"
            emphasis="danger"
            onPress={() => {
              all.remove(claim.id);
              navigate.go("screen.employee-claims");
            }}
          />
        </>
      ) : (
        <Alert id="alert.locked" tone="info" title="This claim is locked" text="A decided claim can no longer be edited or withdrawn." />
      )}
    </Shell>
  );
}

function ManagerQueue() {
  const state = useDisplayState();
  const all = useCollection<Claim>("claims");
  const pending =
    state === "state.empty"
      ? []
      : all.items.filter((c) => c.managerName === "Lee Osei" && c.status === "Pending");
  return (
    <Shell>
      <Heading id="heading.manager-queue" text="Pending Claims" />
      {state === "state.failed" && (
        <Alert id="alert.queue-failed" tone="error" title="Could not load the team's claims" text="Try again in a few minutes." />
      )}
      <Section id="section.pending" title="Team claims awaiting a decision" count={pending.length} subtitle="Oldest first.">
        <Table
          id="table.pending"
          columns={["Employee", "Date", "Category", { label: "Amount", kind: "number" }]}
          rows={pending.map((c) => ({
            id: `pending.${c.id}`,
            cells: [c.employeeName, c.date, c.category, c.amount],
            to: "screen.claim-review",
            params: { claim: c.id },
          }))}
          empty={<EmptyState id="empty.queue" title="Nothing pending" text="New claims from your team appear here." />}
        />
      </Section>
    </Shell>
  );
}

function ClaimReview() {
  const { claim: id } = useParams();
  const state = useDisplayState();
  const navigate = useNav();
  const all = useCollection<Claim>("claims");
  const [rejecting, setRejecting] = useState(false);
  const claim = (id ? all.get(id) : undefined) ?? all.items.find((c) => c.status === "Pending") ?? all.items[0]!;
  const approve = () => {
    all.update(claim.id, { status: "Approved" });
    navigate.go("screen.manager-queue");
  };
  const reject = (reason: string) => {
    all.update(claim.id, { status: "Rejected", rejectionReason: reason });
    navigate.go("screen.manager-queue");
  };
  return (
    <Shell>
      <Heading id="heading.claim-review" text={`Claim from ${claim.employeeName}`} />
      <Detail
        id="detail.review"
        fields={[
          { label: "Date", value: claim.date },
          { label: "Category", value: claim.category },
          { label: "Amount", value: claim.amount },
          { label: "Description", value: claim.description },
          { label: "Receipt", value: claim.receiptAttached ? "Attached" : "Not required" },
        ]}
      />
      <Button id="btn.approve" label="Approve" emphasis="primary" onPress={approve} />
      <Button id="btn.reject" label="Reject" emphasis="danger" onPress={() => setRejecting(true)} />
      <Dialog id="dialog.reject" title={`Reject claim from ${claim.employeeName}`} open={rejecting} onClose={() => setRejecting(false)}>
        <Form
          id="form.reject"
          onSubmit={(values) => reject(values.reason ?? "")}
          actions={<Button id="btn.confirm-reject" label="Reject" emphasis="danger" submit />}
        >
          <Field
            id="field.reason"
            name="reason"
            label="Reason"
            type="textarea"
            required
            error={state === "state.validation-error" ? "Give the employee a reason" : undefined}
          />
        </Form>
      </Dialog>
    </Shell>
  );
}

function FinanceExport() {
  const state = useDisplayState();
  const all = useCollection<Claim>("claims");
  const [justExported, setJustExported] = useState(false);
  const exportable =
    state === "state.empty"
      ? []
      : all.items.filter((c) => c.status === "Approved" && !c.exported);
  const runExport = () => {
    exportable.forEach((c) => all.update(c.id, { exported: true }));
    setJustExported(true);
  };
  return (
    <Shell>
      <Heading
        id="heading.finance-export"
        text="Payroll Export"
        actions={<Button id="btn.export" label="Export Batch" emphasis="primary" onPress={runExport} disabled={exportable.length === 0} />}
      />
      {state === "state.failed" && (
        <Alert id="alert.export-failed" tone="error" title="The export did not complete" text="The payroll system did not confirm receipt. Try again." />
      )}
      {justExported && (
        <Alert id="alert.export-success" tone="success" title="Export complete" text={`${exportable.length} claim(s) were sent to payroll.`} />
      )}
      <Section id="section.exportable" title="Approved claims ready for export" count={exportable.length} subtitle="Every approved claim not yet included in an export.">
        <Table
          id="table.exportable"
          columns={["Employee", "Date", "Category", { label: "Amount", kind: "number" }]}
          rows={exportable.map((c) => ({
            id: `exportable.${c.id}`,
            cells: [c.employeeName, c.date, c.category, c.amount],
          }))}
          empty={<EmptyState id="empty.exportable" title="Nothing to export" text="Every approved claim has already been exported." />}
        />
      </Section>
    </Shell>
  );
}

function Account() {
  const role = useRole() as keyof typeof users;
  const user = users[role] ?? users.Employee;
  return (
    <Shell>
      <Heading id="heading.account" text="Account" />
      <Detail
        id="detail.account"
        fields={[
          { label: "Name", value: user.name },
          { label: "Email", value: user.email },
          { label: "Role", value: user.role },
        ]}
      />
    </Shell>
  );
}

function Settings() {
  const navigate = useNav();
  const role = useRole();
  return (
    <Shell>
      <Heading id="heading.settings" text="Settings" />
      <Form
        id="form.settings"
        onSubmit={() => navigate.go(role === "Manager" ? "screen.manager-queue" : role === "PayrollExporter" ? "screen.finance-export" : "screen.employee-claims")}
        actions={<Button id="btn.save-settings" label="Save Settings" emphasis="primary" submit />}
      >
        <Field id="field.email-notifications" name="emailNotifications" label="Email me when a claim is decided" type="switch" defaultValue="on" />
      </Form>
    </Shell>
  );
}

function SignedOut() {
  const role = useRole();
  const home =
    role === "Manager" ? "screen.manager-queue" : role === "PayrollExporter" ? "screen.finance-export" : "screen.employee-claims";
  return (
    <Screen>
      <Heading id="heading.signed-out" text="You are signed out" />
      <Button id="btn.sign-in" label="Sign in" emphasis="primary" to={home} />
    </Screen>
  );
}

export default defineApp({
  screens: {
    "screen.employee-claims": EmployeeClaims,
    "screen.new-claim": NewClaim,
    "screen.claim-detail": ClaimDetail,
    "screen.manager-queue": ManagerQueue,
    "screen.claim-review": ClaimReview,
    "screen.finance-export": FinanceExport,
    "screen.account": Account,
    "screen.settings": Settings,
    "screen.signed-out": SignedOut,
  },
  data: { claims },
});
