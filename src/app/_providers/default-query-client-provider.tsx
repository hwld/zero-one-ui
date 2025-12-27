import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

type Props = { children: ReactNode };

export const DefaultQueryClientProvider: React.FC<Props> = ({ children }) => {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: 1 },
        mutations: {
          onSettled: async () => {
            if (client.isMutating() === 1) {
              await client.invalidateQueries();
            }
          },
          onError: (e) => {
            console.error(e);
          },
        },
      },
    });

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
