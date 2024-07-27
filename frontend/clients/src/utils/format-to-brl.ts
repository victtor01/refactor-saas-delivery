function formatToBRL(value: number | undefined | null): string {

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0) ;
}

export { formatToBRL }