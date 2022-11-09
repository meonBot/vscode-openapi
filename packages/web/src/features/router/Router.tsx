import { RouterContext, Routes } from "./RouterContext";
import { useFeatureSelector } from "./slice";

export default function Router() {
  return (
    <RouterContext.Consumer>{(routes) => <InnerRouter routes={routes} />}</RouterContext.Consumer>
  );
}

function InnerRouter({ routes }: { routes: Routes }) {
  const current = useFeatureSelector((state) => state.router.current);
  const route = routes.filter((route) => route.id == current[0]);
  if (route.length == 0) {
    return <div>Starting...</div>;
  }
  return <div>{route[0].element}</div>;
}
