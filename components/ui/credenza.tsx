"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"


interface CredenzaRootProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
   asChild?: boolean
}

export function Credenza({
  open,
  onOpenChange,
  children,
}: CredenzaRootProps){
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const Root = isDesktop ? Dialog : Drawer

  return (
    <Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Root>
  )
}

/* ---------------- Subcomponents ---------------- */

export function CredenzaTrigger({ children, asChild = false, }: { children: React.ReactNode,  asChild?: boolean}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const Trigger = isDesktop ? DialogTrigger : DrawerTrigger
  return <Trigger asChild={asChild}>{children}</Trigger>
}

export function CredenzaContent({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const Content = isDesktop ? DialogContent : DrawerContent
  return <Content>{children}</Content>
}

export function CredenzaHeader({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const Header = isDesktop ? DialogHeader : DrawerHeader
  return <Header>{children}</Header>
}

export function CredenzaTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const Title = isDesktop ? DialogTitle : DrawerTitle
  return <Title className={className}>{children}</Title>
}

export function CredenzaDescription({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const Description = isDesktop
    ? DialogDescription
    : DrawerDescription
  return <Description>{children}</Description>
}

export function CredenzaBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={className}>{children}</div>
}

export function CredenzaFooter({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const Footer = isDesktop ? DialogFooter : DrawerFooter
  return <Footer>{children}</Footer>
}

export function CredenzaClose({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const Close = isDesktop ? DialogClose : DrawerClose
  return <Close asChild>{children}</Close>
}
