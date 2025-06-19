import { Card, CardContent } from "@/components/ui/card";
import PropertyForm from "./propertyForm";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export default async function Home() {
  const getRegions = async () => {
    const res = await fetch(`${BACKEND_URL}/regions`);
    const data = await res.json();
    return data;
  };
  const { regions } = await getRegions();
  if (!regions || regions?.length === 0) {
    return (
      <main className="max-w-screen-2xl mx-auto min-h-screen p-10">
        <h1 className="text-bold text-center text-3xl font-bold">
          Something went wrong, please try again later.
        </h1>
      </main>
    );
  }

  console.log(regions);

  return (
    <main className="max-w-screen-2xl mx-auto min-h-screen p-10 flex-col flex items-center">
      <h1 className="text-bold text-center text-3xl font-bold">
        Welcome to Mumbai House Estimator
      </h1>
      <p className="text-center max-w-prose text-balance text-muted-foreground">
        Enter your desired property details below and let our AI analyze and
        estimate the price for it.
      </p>
      <Card className="my-10">
        <CardContent>
          <PropertyForm regions={regions} />
        </CardContent>
      </Card>
    </main>
  );
}
