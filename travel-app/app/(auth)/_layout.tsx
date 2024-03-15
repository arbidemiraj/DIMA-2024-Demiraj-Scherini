import React from 'react'
import { Slot, Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: "center", title: "Login/SignUp" }} />
  )
}

