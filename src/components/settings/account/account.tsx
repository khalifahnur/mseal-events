"use client"

import { useAuth } from '@/components/auth/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Mail, Phone, User, Lock, Bell } from 'lucide-react'

export default function Account() {
  const { user } = useAuth()

  // State for editable fields
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '')
  const [emailNotifications, setEmailNotifications] = useState(true)

  const handleSave = () => {
    setIsEditing(false)
    console.log('Saving updated details:', { firstName, lastName, phoneNumber })
  }

  // Handle password change (placeholder)
  const handlePasswordChange = () => {
    console.log('Initiating password change')
  }

  return (
    <Card className=" mx-auto">
      <CardHeader>
        <CardTitle>My Account</CardTitle>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-lg">Profile Information</h4>
            <Button
              variant={isEditing ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit'}
              <User className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" alt="Profile picture" />
              <AvatarFallback>
                {user?.firstName[0]}
                {user?.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input id="email" value={user?.email} disabled />
              </div>
            </div>
          </div>
          {isEditing && (
            <Button onClick={handleSave} className="mt-2">
              Save Changes
            </Button>
          )}
        </div>

        {/* Password */}
        <div className="space-y-4">
          <h4 className="font-medium text-lg">Password</h4>
          <p className="text-sm text-muted-foreground">
            Change your password to keep your account secure
          </p>
          <Button variant="outline" onClick={handlePasswordChange}>
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </Button>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <h4 className="font-medium text-lg">Notifications</h4>
          <p className="text-sm text-muted-foreground">
            Configure how you receive notifications
          </p>
          <div className="flex items-center space-x-2">
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
            <Label htmlFor="email-notifications" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Receive email notifications
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}