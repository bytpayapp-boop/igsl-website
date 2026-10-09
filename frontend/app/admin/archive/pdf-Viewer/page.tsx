'use client'

import PdfPreview from "@/components/gallery/pdfViewer"
import { useEffect, useState } from "react"
export default function pdfViewPage(){

    const[pdfLink, setPdfLink]= useState('')
    useEffect(()=>{

        const pdfLinkData = localStorage.getItem('pdfLink')
        if(pdfLinkData){setPdfLink(pdfLinkData); return}
console.log('No pdf founfd in the local storage to be passed to the viewer')
    },[])

    return(
        <PdfPreview link={pdfLink}/>
    )

}