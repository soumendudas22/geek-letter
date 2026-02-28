'use client'

import { useState } from 'react'
import { Loader2, Upload, X, Eye, EyeOff, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Category, Tag } from '@/types/database'

interface PostFormProps {
  initialData?: {
    id?: string
    title: string
    slug: string
    content: string
    excerpt: string
    cover_image: string
    category_id: string
    meta_title: string
    meta_description: string
    selectedTags: string[]
  }
  categories: Category[]
  tags: Tag[]
  onSubmit: (data: FormData) => Promise<void>
  isEditing?: boolean
}

/**
 * PostForm — improved admin post creation form.
 *
 * Layout improvements:
 * - Card-based sections for visual grouping
 * - Proper spacing between labels and inputs (gap-3 per field)
 * - Full-width content editor section
 * - Better responsive grid (single column on mobile)
 * - Action buttons with proper spacing
 */
export function PostForm({
  initialData,
  categories,
  tags,
  onSubmit,
  isEditing = false,
}: PostFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [coverImage, setCoverImage] = useState(initialData?.cover_image || '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '')
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || '')
  const [metaDescription, setMetaDescription] = useState(
    initialData?.meta_description || ''
  )
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialData?.selectedTags || []
  )
  const [uploading, setUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (!isEditing || !initialData?.slug) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setCoverImage(data.url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('slug', slug)
    formData.append('content', content)
    formData.append('excerpt', excerpt)
    formData.append('cover_image', coverImage)
    formData.append('category_id', categoryId)
    formData.append('meta_title', metaTitle)
    formData.append('meta_description', metaDescription)
    formData.append('tags', JSON.stringify(selectedTags))
    if (initialData?.id) {
      formData.append('id', initialData.id)
    }

    await onSubmit(formData)
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-5">
        {/* ── Left column: Main content (3/5 width) ────────── */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Post Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter a compelling title..."
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="url-friendly-slug"
                  className="h-11 font-mono text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A brief summary that appears in previews..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 p-3 rounded-lg border bg-background min-h-11">
                    {tags.length > 0 ? tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                        className="cursor-pointer transition-all hover:scale-105"
                        onClick={() => handleTagToggle(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    )) : (
                      <span className="text-sm text-muted-foreground">No tags available</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content editor */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Content (HTML)</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showPreview ? 'Editor' : 'Preview'}
              </Button>
            </CardHeader>
            <CardContent>
              {showPreview ? (
                <div
                  className="prose max-w-none min-h-[320px] p-4 rounded-lg border bg-background"
                  dangerouslySetInnerHTML={{ __html: content || '<p class="text-muted-foreground">Nothing to preview yet...</p>' }}
                />
              ) : (
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={16}
                  required
                  placeholder="Write your post content in HTML..."
                  className="font-mono text-sm resize-y min-h-[320px]"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Right column: Sidebar (2/5 width) ────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              {coverImage ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="object-cover w-full h-full"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={() => setCoverImage('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 hover:border-primary/30 transition-all">
                  {uploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                  <span className="mt-3 text-sm text-muted-foreground font-medium">
                    {uploading ? 'Uploading...' : 'Click to upload'}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground/60">
                    JPG, PNG, or WebP
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </CardContent>
          </Card>

          {/* SEO section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO-optimized title..."
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Brief description for search engines..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <Button type="submit" disabled={isLoading} size="lg" className="rounded-full px-8">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Post' : 'Publish Post'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="rounded-full"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
