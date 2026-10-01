import { useState, type FormEvent } from 'react'
import { ApiError } from '../api/client'
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '../categories/api'
import { slugify } from '../categories/slugify'
import type { Category } from '../categories/types'

export function AdminCategoriesPage() {
  const { data, isLoading, isError } = useCategories()
  const categories = data?.categories ?? []

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold">Categorías</h1>

      <NewCategoryForm />

      {isLoading && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-md text-primary" />
        </div>
      )}

      {isError && <p className="py-8 text-center text-sm text-error">No pudimos cargar las categorías.</p>}

      {!isLoading && !isError && categories.length === 0 && (
        <p className="py-8 text-center text-sm text-base-content/60">Todavía no hay categorías.</p>
      )}

      <ul className="flex flex-col gap-2">
        {categories.map((category) => (
          <CategoryRow key={category.id} category={category} />
        ))}
      </ul>
    </div>
  )
}

function NewCategoryForm() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const createCategory = useCreateCategory()

  function handleNameChange(value: string): void {
    setName(value)
    if (!slugTouched) {
      setSlug(slugify(value))
    }
  }

  function handleSubmit(event: FormEvent): void {
    event.preventDefault()
    if (!name.trim() || !slug.trim()) return

    createCategory.mutate(
      { name: name.trim(), slug: slug.trim() },
      {
        onSuccess: () => {
          setName('')
          setSlug('')
          setSlugTouched(false)
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-base-100 p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-bold text-base-content/70">Nueva categoría</h2>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          className="input input-bordered flex-1"
          placeholder="Nombre"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
        />
        <input
          type="text"
          className="input input-bordered flex-1"
          placeholder="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true)
            setSlug(e.target.value)
          }}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={createCategory.isPending}>
          {createCategory.isPending ? <span className="loading loading-spinner loading-sm" /> : 'Crear'}
        </button>
      </div>
      {createCategory.isError && (
        <p className="mt-2 text-sm text-error">
          {createCategory.error instanceof ApiError ? createCategory.error.message : 'No pudimos crear la categoría.'}
        </p>
      )}
    </form>
  )
}

function CategoryRow({ category }: { category: Category }) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [slug, setSlug] = useState(category.slug)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const update = useUpdateCategory()
  const remove = useDeleteCategory()
  const error = update.error ?? remove.error

  function cancelEdit(): void {
    setIsEditing(false)
    setName(category.name)
    setSlug(category.slug)
  }

  function saveEdit(): void {
    if (!name.trim() || !slug.trim()) return
    update.mutate(
      { id: category.id, name: name.trim(), slug: slug.trim() },
      { onSuccess: () => setIsEditing(false) },
    )
  }

  if (isEditing) {
    return (
      <li className="rounded-2xl bg-base-100 p-3 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            className="input input-bordered input-sm flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="input input-bordered input-sm flex-1"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <div className="flex gap-2">
            <button type="button" className="btn btn-primary btn-sm" disabled={update.isPending} onClick={saveEdit}>
              Guardar
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEdit}>
              Cancelar
            </button>
          </div>
        </div>
        {error && (
          <p className="mt-1 text-xs text-error">
            {error instanceof ApiError ? error.message : 'No pudimos guardar los cambios.'}
          </p>
        )}
      </li>
    )
  }

  return (
    <li className="flex flex-col gap-1 rounded-2xl bg-base-100 p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold">{category.name}</h3>
          <p className="truncate text-xs text-base-content/50">{category.slug}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" className="btn btn-ghost btn-xs" onClick={() => setIsEditing(true)}>
            Editar
          </button>
          {confirmingDelete ? (
            <button
              type="button"
              className="btn btn-error btn-xs"
              disabled={remove.isPending}
              onClick={() => remove.mutate(category.id)}
            >
              ¿Confirmar?
            </button>
          ) : (
            <button type="button" className="btn btn-ghost btn-xs" onClick={() => setConfirmingDelete(true)}>
              Eliminar
            </button>
          )}
        </div>
      </div>
      {error && (
        <p className="text-xs text-error">{error instanceof ApiError ? error.message : 'No pudimos eliminar.'}</p>
      )}
    </li>
  )
}
