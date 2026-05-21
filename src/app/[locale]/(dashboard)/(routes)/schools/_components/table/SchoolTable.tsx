"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PenBoxIcon, Trash2Icon, School as SchoolIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocale, useTranslations } from "next-intl";
import { RootState } from "@/store";
import ShowDialog from "@/components/ShowDialog";
import AddSchool from "../addSchool/AddSchool";
import { fetchSchools, deleteSchool } from "@/store/slices/schools/thunks";
import { setCurrPage } from "@/store/slices/schools/slice";
import { TablePagination } from "@/components/TablePagination";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  }),
};

function SchoolsTable() {
  const locale = useLocale();
  const t = useTranslations("schoolsPage");
  const dispatch = useAppDispatch();
  const { schools, loading, currPage, totalPages, searchName, statusFilter } =
    useAppSelector((state: RootState) => state.schools);

  const columns: ColumnDef<any>[] = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: () => <div className="text-start ml-4">{t("schoolName")}</div>,
        cell: ({ row }) => (
          <div className="flex items-center gap-3 px-4 py-1">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <SchoolIcon className="size-4 text-primary" />
            </div>
            <span className="font-semibold text-foreground/90 group-hover:text-primary transition-colors">
              {row.original?.name ?? "--"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "code",
        header: () => <div className="text-center">{t("schoolCode")}</div>,
        cell: ({ row }) => (
          <div className="flex justify-center ">
            <span className="text-center font-mono text-sm bg-muted/50 py-1 rounded-md px-2 inline-block ">
              {row.original?.code ?? "--"}
            </span>
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-center">{t("actions")}</div>,
        cell: ({ row }) => (
          <div className="flex justify-center gap-2">
            <AddSchool isEdit schoolData={row.original}>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-primary hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
              >
                <PenBoxIcon className="size-4" />
              </Button>
            </AddSchool>

            <ShowDialog
              discription={t("areYouSureDelete")}
              onConfirm={async () => {
                const toastId = toast.loading("Deleting school...", {
                  position: "top-center",
                });
                try {
                  await dispatch(deleteSchool(row.original.id)).unwrap();
                  toast.success("School deleted successfully", {
                    position: "top-center",
                    id: toastId,
                  });
                } catch (error: any) {
                  const msg =
                    typeof error === "string"
                      ? error
                      : error?.message || "Failed to delete school";
                  toast.error(msg, {
                    position: "top-center",
                    id: toastId,
                  });
                }
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all active:scale-90"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </ShowDialog>
          </div>
        ),
      },
    ],
    [locale, dispatch, t],
  );

  const table = useReactTable({
    data: schools,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  React.useEffect(() => {
    dispatch(fetchSchools({ page: Number(currPage) }));
  }, [dispatch, currPage, searchName, statusFilter]);

  return (
    <div className="flex flex-col gap-4 shadow-xl shadow-black/5 rounded-xl bg-card border border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50 border-b border-border/50">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-foreground/70 font-bold text-sm h-14 bg-transparent border-none"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            <AnimatePresence mode="wait">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell colSpan={columns.length} className="p-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="size-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-3 w-[150px]" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : schools.length === 0 ? (
                <TableRow
                  key="no-data"
                  className="h-[300px] hover:bg-transparent"
                >
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-muted-foreground italic"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <SchoolIcon className="size-12 opacity-10" />
                      <p>{t("noSchoolsFound") || "No schools found"}</p>
                    </motion.div>
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.original.id}
                    className="group hover:bg-muted/30 transition-colors border-b border-border/40 last:border-0"
                  >
                    {row.getVisibleCells().map((cell: any) => (
                      <TableCell key={cell.id} className="py-2">
                        <motion.div
                          variants={rowVariants}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </motion.div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      <div className="p-4 bg-muted/20 border-t border-border/50">
        <TablePagination
          currentPage={Number(currPage)}
          totalPages={totalPages}
          onPageChange={(page) => dispatch(setCurrPage(page.toString()))}
        />
      </div>
    </div>
  );
}

export default SchoolsTable;
