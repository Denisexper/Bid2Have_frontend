function storageKey(userId: string, listingId: string): string {
  return `bid2have_offer_${userId}_${listingId}`
}

export function getMyOfferId(userId: string, listingId: string): string | null {
  return localStorage.getItem(storageKey(userId, listingId))
}

export function setMyOfferId(userId: string, listingId: string, offerId: string): void {
  localStorage.setItem(storageKey(userId, listingId), offerId)
}
