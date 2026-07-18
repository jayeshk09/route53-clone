"use client";

import { useState } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { HostedZone } from "@/types";

interface EditZoneFormProps {
  zone: HostedZone;
  onSubmit: (data: { domain_name?: string; description?: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function EditZoneForm({
  zone,
  onSubmit,
  onCancel,
  loading = false,
}: EditZoneFormProps) {
  const [domainName, setDomainName] = useState(zone.domain_name);
  const [description, setDescription] = useState(zone.description || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const domainRegex = /^[a-z0-9]([a-z0-9-]*\.)*[a-z]{2,}$/;

  function validate(): boolean {
    const errs: Record<string, string> = {};
    const normalized = domainName.trim().toLowerCase();

    if (!normalized) errs.domain_name = "Domain name is required";
    else if (normalized.length < 5) errs.domain_name = "Domain name must be at least 5 characters";
    else if (!domainRegex.test(normalized)) errs.domain_name = "Please enter a valid domain name";

    if (description.length > 500) errs.description = "Description must be 500 characters or less";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const changes: { domain_name?: string; description?: string } = {};
    const newDomain = domainName.trim().toLowerCase();
    if (newDomain !== zone.domain_name) changes.domain_name = newDomain;
    if (description.trim() !== (zone.description || "")) changes.description = description.trim();

    if (Object.keys(changes).length === 0) {
      onCancel();
      return;
    }

    onSubmit(changes);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Edit hosted zone</h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hosted Zone ID</label>
            <p className="text-sm font-mono text-gray-600">{zone.id.substring(0, 14)}...</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
            <p className="text-sm text-gray-600">{zone.type}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Created</label>
            <p className="text-sm text-gray-600">{new Date(zone.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Record Count</label>
            <p className="text-sm text-gray-600">{zone.record_count}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <Input
            label="Domain Name"
            required
            value={domainName}
            onChange={(e) => {
              setDomainName(e.target.value);
              if (errors.domain_name) setErrors((prev) => ({ ...prev, domain_name: "" }));
            }}
            error={errors.domain_name}
          />
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Description <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb] min-h-[80px] resize-y"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
              }}
              maxLength={500}
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button type="submit" loading={loading}>
            Save
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}