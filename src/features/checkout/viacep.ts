import { sanitizeCep } from "@/features/cart/pricing";

export interface ViaCepAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface ViaCepResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
}

export class CepNotFoundError extends Error {
  constructor(cep: string) {
    super(`CEP ${cep} not found`);
    this.name = "CepNotFoundError";
  }
}

/**
 * Looks up an address on ViaCEP (public, keyless, CORS-enabled), which works
 * from the browser even on a fully static host.
 */
export async function fetchAddressByCep(
  cep: string,
  { signal, fetcher = fetch }: { signal?: AbortSignal; fetcher?: typeof fetch } = {},
): Promise<ViaCepAddress> {
  const digits = sanitizeCep(cep);
  if (digits.length !== 8) throw new CepNotFoundError(cep);

  const response = await fetcher(`https://viacep.com.br/ws/${digits}/json/`, { signal });
  if (!response.ok) throw new Error(`ViaCEP responded with ${response.status}`);

  const data = (await response.json()) as ViaCepResponse;
  if (data.erro) throw new CepNotFoundError(cep);

  return {
    street: data.logradouro ?? "",
    neighborhood: data.bairro ?? "",
    city: data.localidade ?? "",
    state: data.uf ?? "",
  };
}
