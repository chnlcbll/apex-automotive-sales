import { Vehicle } from "../types";

export async function getExpertAdvice(vehicles: Vehicle[]): Promise<string> {
  try {
    const res = await fetch('/api/expert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicles })
    });
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.text || "Unable to generate expert advice at this time.";
  } catch (error) {
    console.error("Expert advice failed:", error);
    return "Expert analysis is currently unavailable.";
  }
}

export async function generateCarImage(carName: string, color: string, year: string): Promise<string | null> {
  try {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carName, color, year })
    });
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.imageUrl || null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
}

export async function searchVehicles(
  query?: string, 
  year?: string, 
  color?: string,
  seats?: string,
  vehicleType?: string,
  transmission?: string
): Promise<Vehicle[]> {
  try {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, year, color, seats, vehicleType, transmission })
    });
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.vehicles || [];
  } catch (error) {
    console.error("Vehicle search failed:", error);
    return [];
  }
}
