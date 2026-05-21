# استخدام append في Redux

## 📖 شرح المفهوم

الـ `append` يُستخدم للتمييز بين حالتين:

### 1. **جلب البيانات العادي** (`append = false`)

- استبدال البيانات الحالية بالبيانات الجديدة
- يُستخدم في:
  - التحميل الأول للصفحة
  - تحديث البيانات (Refresh)
  - البحث أو الفلترة
  - الانتقال لصفحة جديدة (مع استبدال)

### 2. **تحميل المزيد** (`append = true`)

- إضافة البيانات الجديدة للبيانات الموجودة
- يُستخدم في:
  - زر "تحميل المزيد" (Load More)
  - التمرير اللانهائي (Infinite Scroll)
  - التحميل الكسول (Lazy Loading)

---

## 💻 أمثلة الاستخدام

### مثال 1: جلب التصنيفات (الصفحة الأولى)

```typescript
// في Component
useEffect(() => {
  // append = false (افتراضي) - يستبدل البيانات
  dispatch(fetchCategories({ page: 1 }));
}, []);
```

**النتيجة:**

```
categories = [Category1, Category2, Category3]
```

---

### مثال 2: تحميل المزيد من التصنيفات

```typescript
// عند النقر على زر "تحميل المزيد"
const handleLoadMore = () => {
  const nextPage = currentPage + 1;

  // append = true - يضيف للبيانات الموجودة
  dispatch(
    fetchCategories({
      page: nextPage,
      append: true,
    }),
  );
};
```

**النتيجة:**

```
// قبل:
categories = [Category1, Category2, Category3]

// بعد:
categories = [Category1, Category2, Category3, Category4, Category5, Category6]
```

---

### مثال 3: البحث عن تصنيف معين

```typescript
const handleSearch = (searchTerm: string) => {
  // append = false - يستبدل البيانات بنتائج البحث
  dispatch(
    fetchCategories({
      page: 1,
      search: searchTerm,
      append: false,
    }),
  );
};
```

**النتيجة:**

```
// قبل:
categories = [Category1, Category2, Category3]

// بعد البحث:
categories = [SearchResult1, SearchResult2] // استبدال كامل
```

---

## 🎯 مثال كامل: Infinite Scroll Component

```typescript
"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/store/slices/categories/thunks";

function CategoriesWithInfiniteScroll() {
  const dispatch = useDispatch();
  const { categories, loading, currPage, totalPages } = useSelector(
    (state: RootState) => state.categories
  );

  const observerRef = useRef<IntersectionObserver>();
  const lastElementRef = useRef<HTMLDivElement>(null);

  // جلب الصفحة الأولى
  useEffect(() => {
    dispatch(fetchCategories({ page: 1, append: false }));
  }, []);

  // Infinite Scroll
  useEffect(() => {
    if (loading) return;

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && Number(currPage) < totalPages) {
        // تحميل الصفحة التالية مع append
        dispatch(fetchCategories({
          page: Number(currPage) + 1,
          append: true // ✅ نضيف للبيانات الموجودة
        }));
      }
    });

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loading, currPage, totalPages]);

  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>{category.name}</div>
      ))}

      {/* عنصر غير مرئي للمراقبة */}
      <div ref={lastElementRef} />

      {loading && <div>جاري التحميل...</div>}
    </div>
  );
}
```

---

## 🎯 مثال: زر "تحميل المزيد"

```typescript
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/store/slices/categories/thunks";
import { Button } from "@/components/ui/button";

function CategoriesWithLoadMore() {
  const dispatch = useDispatch();
  const { categories, loading, currPage, totalPages } = useSelector(
    (state: RootState) => state.categories
  );

  // جلب الصفحة الأولى
  useEffect(() => {
    dispatch(fetchCategories({ page: 1 }));
  }, []);

  // دالة تحميل المزيد
  const handleLoadMore = () => {
    dispatch(fetchCategories({
      page: Number(currPage) + 1,
      append: true // ✅ نضيف للبيانات الموجودة
    }));
  };

  const hasMore = Number(currPage) < totalPages;

  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>{category.name}</div>
      ))}

      {hasMore && (
        <Button
          onClick={handleLoadMore}
          disabled={loading}
        >
          {loading ? "جاري التحميل..." : "تحميل المزيد"}
        </Button>
      )}
    </div>
  );
}
```

---

## 📊 Flow Chart

```
عند استدعاء fetchCategories({ page, append })
                    ↓
            هل append = true؟
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
       نعم                      لا
        ↓                       ↓
   إضافة البيانات          استبدال البيانات
   الجديدة للموجودة          بالبيانات الجديدة
        ↓                       ↓
categories =            categories =
[...old, ...new]           [...new]
```

---

## ⚠️ نصائح مهمة

1. **استخدم `append: false`** عند:
   - البحث
   - الفلترة
   - التحديث (Refresh)
   - الانتقال لصفحة مختلفة تماماً

2. **استخدم `append: true`** عند:
   - "تحميل المزيد"
   - Infinite Scroll
   - التحميل التدريجي

3. **تجنب الأخطاء الشائعة:**

   ```typescript
   // ❌ خطأ: استخدام append مع البحث
   dispatch(
     fetchCategories({
       search: "kitchen",
       append: true, // خطأ! سيضيف نتائج البحث للبيانات القديمة
     }),
   );

   // ✅ صحيح
   dispatch(
     fetchCategories({
       search: "kitchen",
       append: false, // صحيح! يستبدل بنتائج البحث
     }),
   );
   ```
