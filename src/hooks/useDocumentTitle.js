import { useEffect } from 'react'

// Sets document.title for the lifetime of the page that calls it, and
// restores the previous title on unmount. No routing/head library needed
// for a site this size.
export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}
