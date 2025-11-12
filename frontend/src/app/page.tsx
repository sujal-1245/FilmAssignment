"use client"

import React from 'react'
import LandingPage from './components/landingPage/LandingPage'

import { Table } from '@/components/ui/table'
import SubmissionTable from './components/SubmissionTable'
import Page from './login/page'
import ExploreFilmClub from './components/landingPage/ExploreFilmClub'

const page = () => {
  return (
    <div>
    <LandingPage />
    <SubmissionTable />
    <ExploreFilmClub />

    </div>
  )
}

export default page
