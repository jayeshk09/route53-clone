"use client";

import { useState } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { DNSRecord, RecordType } from "@/types";

interface EditRecordFormProps {
  record: DNSRecord;
  zoneDomain: string;
  onSubmit: (data: { value: string; ttl: number }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function EditRecordForm({
  record,
  zoneDomain,
  onSubmit,
  onCancel,
  loading = false,
}: EditRecordFormProps) {
  const [value, setValue] = useState(record.value);
  const [ttl, setTtl] = useState(record.ttl);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const recordName =
    record.name === "@" ? zoneDomain : `${record.name}.${zoneDomain}`;

  function validate(): boolean {
    const errs: Record<string, string> = {};

    if (!value.trim()) errs.value = "Value is required";
    else if (record.type === "A") {
      const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipv4Regex.test(value.trim())) errs.value = "Please enter a valid IPv4 address";
    }

    if (ttl < 60 || ttl > 86400) errs.ttl = "TTL must be between 60 and 86400";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ value: value.trim(), ttl });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Record Name</label>
            <p className="text-sm font-mono text-gray-700">{recordName}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
            <p className="text-sm font-mono text-gray-700">{record.type}</p>
          </div>
        </div>

        <Input
          label="Value"
          required
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (errors.value) setErrors((prev) => ({ ...prev, value: "" }));
          }}
          error={errors.value}
        />

        <Input
          label="TTL (seconds)"
          required
          type="number"
          min={60}
          max={86400}
          value={ttl}
          onChange={(e) => {
            setTtl(Number(e.target.value));
            if (errors.ttl) setErrors((prev) => ({ ...prev, ttl: "" }));
          }}
          error={errors.ttl}
        />
      </div>

      <div className="flex gap-3 mt-8">
        <Button type="submit" loading={loading}>
          Save
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}