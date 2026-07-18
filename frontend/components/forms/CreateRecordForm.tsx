"use client";

import { useState } from "react";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";
import { RecordType, RECORD_TYPES } from "@/types";

interface CreateRecordFormProps {
  zoneDomain: string;
  onSubmit: (data: {
    name: string;
    type: RecordType;
    value: string;
    ttl: number;
  }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function CreateRecordForm({
  zoneDomain,
  onSubmit,
  onCancel,
  loading = false,
}: CreateRecordFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<RecordType>("A");
  const [value, setValue] = useState("");
  const [ttl, setTtl] = useState(300);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const placeholders: Record<RecordType, string> = {
    A: "192.0.2.1",
    AAAA: "2001:db8::1",
    CNAME: "target.example.com",
    TXT: '"v=spf1 -all"',
    MX: "10 mail.example.com",
    NS: "ns1.example.com",
    PTR: "example.com",
    SRV: "10 20 80 target.example.com",
    CAA: '0 issue "ca.example.com"',
  };

  function validate(): boolean {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = "Record name is required";

    if (!value.trim()) {
      errs.value = "Value is required";
    } else if (type === "A") {
      const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipv4Regex.test(value.trim())) errs.value = "Please enter a valid IPv4 address";
    } else if (type === "CNAME" || type === "NS" || type === "PTR") {
      if (!value.includes(".")) errs.value = "Please enter a valid domain";
    } else if (type === "MX") {
      const parts = value.trim().split(/\s+/);
      if (parts.length < 2) errs.value = "Format: priority mail-server (e.g. '10 mail.example.com')";
    }

    if (ttl < 60 || ttl > 86400) errs.ttl = "TTL must be between 60 and 86400";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name: name.trim() || "@", type, value: value.trim(), ttl });
  }

  const typeOptions = RECORD_TYPES.map((t) => ({ value: t, label: t }));

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5">
        <div>
          <Input
            label="Record Name"
            required
            placeholder="www"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            error={errors.name}
          />
          <p className="text-xs text-gray-400 mt-1">
            Leave blank to use zone apex (@) —{" "}
            <span className="font-mono">{zoneDomain}</span>
          </p>
        </div>

        <Select
          label="Type"
          required
          options={typeOptions}
          value={type}
          onChange={(e) => {
            setType(e.target.value as RecordType);
            setValue("");
            setErrors({});
          }}
        />

        <div>
          <Input
            label="Value"
            required
            placeholder={placeholders[type]}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (errors.value) setErrors((prev) => ({ ...prev, value: "" }));
            }}
            error={errors.value}
          />
        </div>

        <Input
          label="TTL (seconds)"
          required
          type="number"
          placeholder="300"
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
          Create
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}