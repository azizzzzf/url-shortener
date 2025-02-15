import React from 'react'
import ShortenForm from './shorten-form'
import UrlList from './url-list'

export default function UrlShortenerContainer() {
  return (
    <div className='space-y-4'>
      <ShortenForm />
      <UrlList />
    </div>
  )
}
