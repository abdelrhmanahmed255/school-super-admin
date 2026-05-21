import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useLocale } from "next-intl";

function ShowDialog({
  children,
  discription,
  onConfirm,
}: {
  children: React.ReactNode;
  discription?: string;
  onConfirm: () => void;
}) {
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onPointerDown={(e) => {
          //   e.preventDefault(); // يمنع الإغلاق الافتراضي
          e.stopPropagation(); // يمنع انتشار الحدث
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault(); // يمنع الإغلاق الافتراضي
          e.stopPropagation(); // يمنع انتشار الحدث
          //   setOpen(false); // يغلق الـ Dialog يدويًا
        }}
        className="max-w-3xl p-4"
        dir={locale === "en" ? "ltr" : "rtl"}
        showCloseButton={false}
      >
        <DialogTitle>
          <p className="font-semibold text-lg py-3">{discription}</p>
        </DialogTitle>
        <div className="flex flex-col gap-6 ">
          <div className="flex gap-3 justify-end">
            <DialogClose
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onConfirm();
                setOpen(false);
              }}
              className="bg-primary rounded-lg text-white cursor-pointer hover:bg-primary/80  w-32 h-12  "
            >
              {locale === "en" ? "Confirm" : "تأكيد"}
            </DialogClose>
            <DialogClose
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="border  border-red-700! hover:bg-red-100 rounded-lg w-32 h-12 cursor-pointer"
            >
              {locale === "en" ? "Cancel" : "اغلاق"}
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShowDialog;
