"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createSchool,
  editSchool,
  fetchSchools,
} from "@/store/slices/schools/thunks";
import { toast } from "sonner";
import { School } from "@/store/slices/schools/type";
import { useTranslations } from "next-intl";

function AddSchool({
  children,
  isEdit,
  schoolData,
}: {
  children: React.ReactNode;
  isEdit?: boolean;
  schoolData?: School;
}) {
  const t = useTranslations("schoolsPage");
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.schools);

  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(schoolData?.name || "");
  const [code, setCode] = React.useState(schoolData?.code || "");
  const [address, setAddress] = React.useState(schoolData?.address || "");
  const [city, setCity] = React.useState(schoolData?.city || "");
  const [state, setState] = React.useState(schoolData?.state || "");
  const [country, setCountry] = React.useState(schoolData?.country || "");
  const [phone, setPhone] = React.useState(schoolData?.phone || "");
  const [email, setEmail] = React.useState(schoolData?.email || "");
  const [website, setWebsite] = React.useState(schoolData?.website || "");
  const [timezone, setTimezone] = React.useState(schoolData?.timezone || "");

  // Reset form when dialog opens/closes or schoolData changes
  React.useEffect(() => {
    if (open) {
      setName(schoolData?.name || "");
      setCode(schoolData?.code || "");
      setAddress(schoolData?.address || "");
      setCity(schoolData?.city || "");
      setState(schoolData?.state || "");
      setCountry(schoolData?.country || "");
      setPhone(schoolData?.phone || "");
      setEmail(schoolData?.email || "");
      setWebsite(schoolData?.website || "");
      setTimezone(schoolData?.timezone || "");
    }
  }, [open, schoolData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: name is required
    if (!name || name.trim() === "") {
      toast.error(t("nameRequired"), {
        position: "top-center",
      });
      return;
    }

    const schoolPayload = {
      name: name.trim(),
      code: code?.trim() || undefined,
      address: address?.trim() || undefined,
      city: city?.trim() || undefined,
      state: state?.trim() || undefined,
      country: country?.trim() || undefined,
      phone: phone?.trim() || undefined,
      email: email?.trim() || undefined,
      website: website?.trim() || undefined,
      timezone: timezone?.trim() || undefined,
    };

    try {
      if (isEdit && schoolData?.id) {
        // Edit existing school
        await dispatch(
          editSchool({
            id: schoolData.id.toString(),
            ...schoolPayload,
          }),
        ).unwrap();

        toast.success(t("schoolUpdated"), {
          position: "top-center",
        });
      } else {
        // Create new school
        await dispatch(createSchool(schoolPayload)).unwrap();

        toast.success(t("schoolCreated"), {
          position: "top-center",
        });
      }

      // Refresh schools list
      dispatch(fetchSchools({ page: 1 }));

      // Reset form and close dialog
      setName("");
      setCode("");
      setAddress("");
      setCity("");
      setState("");
      setCountry("");
      setPhone("");
      setEmail("");
      setWebsite("");
      setTimezone("");
      setOpen(false);
    } catch (error: any) {
      // Error toast is already handled in the thunk
      console.error("Error saving school:", error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    // Reset form
    setName(schoolData?.name || "");
    setCode(schoolData?.code || "");
    setAddress(schoolData?.address || "");
    setCity(schoolData?.city || "");
    setState(schoolData?.state || "");
    setCountry(schoolData?.country || "");
    setPhone(schoolData?.phone || "");
    setEmail(schoolData?.email || "");
    setWebsite(schoolData?.website || "");
    setTimezone(schoolData?.timezone || "");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl text-center">
          {isEdit ? t("editSchool") : t("addSchool")}
        </DialogTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm">
                {t("schoolName")} <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder={t("schoolNamePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">{t("schoolCode")}</label>
              <Input
                type="text"
                placeholder={t("schoolCode")}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">{t("email")}</label>
              <Input
                type="email"
                placeholder="example@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">{t("phone")}</label>
              <Input
                type="text"
                placeholder="+123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm">{t("address")}</label>
              <Input
                type="text"
                placeholder={t("address")}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">{t("city")}</label>
              <Input
                type="text"
                placeholder={t("city")}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">{t("state")}</label>
              <Input
                type="text"
                placeholder={t("state")}
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">{t("country")}</label>
              <Input
                type="text"
                placeholder={t("country")}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">{t("timezone")}</label>
              <Input
                type="text"
                placeholder="America/Chicago"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm">{t("website")}</label>
              <Input
                type="url"
                placeholder="https://school.edu"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-32"
              onClick={handleCancel}
              disabled={loading}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" className="w-32" disabled={loading}>
              {loading ? t("saving") : t("save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddSchool;
