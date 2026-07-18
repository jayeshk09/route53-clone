"use client";

import { useState } from "react";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";

interface CreateZoneFormProps {
  onSubmit: (data: { domain_name: string; type: string; description: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function CreateZoneForm({
  onSubmit,
  onCancel,
  loading = false,
}: CreateZoneFormProps) {
  const [domainName, setDomainName] = useState("");
  const [type, setType] = useState("Public");
  const [description, setDescription] = useState("");
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
    onSubmit({
      domain_name: domainName.trim().toLowerCase(),
      type,
      description: description.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Create hosted zone</h3>

        <div className="space-y-5">
          <Input
            label="Domain Name"
            required
            placeholder="example.com"
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
              placeholder="A short description for this zone"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
              }}
              maxLength={500}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Type</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="Public"
                  checked={type === "Public"}
                  onChange={() => setType("Public")}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-700">Public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="Private"
                  checked={type === "Private"}
                  onChange={() => setType("Private")}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-700">Private</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button type="submit" loading={loading}>
            Create
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}