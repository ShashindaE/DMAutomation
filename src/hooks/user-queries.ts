import {
  getAllAutomations,
  getAutomationInfo,
  getProfilePosts,
} from '@/actions/automations'
import { onUserInfo } from '@/actions/user'
import { useQuery } from '@tanstack/react-query'

export const useQueryAutomations = () => {
  return useQuery({
    queryKey: ['user-automations'],
    queryFn: getAllAutomations,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}

export const useQueryAutomation = (id: string) => {
  return useQuery({
    queryKey: ['automation-info', id],
    queryFn: () => getAutomationInfo(id),
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}

export const useQueryUser = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: onUserInfo,
  })
}

export const useQueryAutomationPosts = () => {
  const fetchPosts = async () => await getProfilePosts()
  return useQuery({
    queryKey: ['instagram-media'],
    queryFn: fetchPosts,
  })
}
