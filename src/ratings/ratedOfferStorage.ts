function storageKey(offerId: string): string {
  return `bid2have_rated_${offerId}`
}

export function hasRatedOffer(offerId: string): boolean {
  return localStorage.getItem(storageKey(offerId)) === '1'
}

export function markOfferRated(offerId: string): void {
  localStorage.setItem(storageKey(offerId), '1')
}
