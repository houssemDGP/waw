import { useEffect, useState } from "react";
import axios from "axios";

import Card1 from "../../components/ecommerce/Card1";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "./StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { GroupIcon } from "../../icons";
import { Link } from "react-router-dom";

export default function DashboradVendeur() {
  const [events, setEvents] = useState([]);
  const [reservationsCount, setReservationsCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [monthlySales, setMonthlySales] = useState<number[]>(new Array(12).fill(0));
  const [monthlyRevenue, setMonthlyRevenue] = useState<number[]>(new Array(12).fill(0));
const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
const [dailyRevenue, setDailyRevenue] = useState<number[]>([]);
const [businessCount, setBusinessCount] = useState(0);

  useEffect(() => {
    axios
  .get("https://waw.com.tn/api/business")
  .then((res) => {
    const data = res.data || [];
    setBusinessCount(data.length);
  })
  .catch((err) => {
    console.error("Erreur chargement businesses:", err);
  });
    axios
      .get("https://waw.com.tn/api/events")
      .then((res) => {
        const data = res.data || [];
        setEvents(data);

        // Nombre total de réservations
        const totalRes = data.reduce(
          (acc, event) => acc + (event.reservations?.length || 0),
          0
        );
        setReservationsCount(totalRes);

        // Total des ventes (réservations confirmées uniquement)
        let totalSalesSum = 0;
        const monthlySalesTemp = new Array(12).fill(0);
        const monthlyRevenueTemp = new Array(12).fill(0);

        data.forEach((event) => {
          const confirmedReservations = event.reservations?.filter(
            (r) => r.status === "CONFIRMER" && r.formule
          ) || [];

          confirmedReservations.forEach((r) => {
            if (!r.date || !r.formule?.price) return;

            const nbAdultes = parseInt(r.nbrAdulte || "0", 10);
            const nbEnfants = parseInt(r.nbrEnfant || "0", 10);
            const totalPeople = nbAdultes + nbEnfants;
            const revenue = totalPeople * r.formule.price;
            totalSalesSum += revenue;

            const month = new Date(r.date).getMonth();
            monthlySalesTemp[month] += 1;
            monthlyRevenueTemp[month] += revenue;
          });
        });

        setTotalSales(totalSalesSum);
        setMonthlySales(monthlySalesTemp);
        setMonthlyRevenue(monthlyRevenueTemp);
const daysInMonth = new Date(new Date().getFullYear(), selectedMonth + 1, 0).getDate();
const dailyRevenueTemp = new Array(daysInMonth).fill(0);

data.forEach((event) => {
  const confirmedReservations = event.reservations?.filter(
    (r) => r.status === "CONFIRMER" && r.formule
  ) || [];

  confirmedReservations.forEach((r) => {
    if (!r.date || !r.formule?.price) return;

    const dateObj = new Date(r.date);
    const monthIndex = dateObj.getMonth(); // 0-11
    const day = dateObj.getDate();
    const monthName = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ][monthIndex];

    if (!dailyRevenueTemp[monthName]) {
      dailyRevenueTemp[monthName] = new Array(31).fill(0);
      dailySalesTemp[monthName] = new Array(31).fill(0);
    }

    const nbAdultes = parseInt(r.nbrAdulte || "0", 10);
    const nbEnfants = parseInt(r.nbrEnfant || "0", 10);
    const totalPeople = nbAdultes + nbEnfants;
    const revenue = totalPeople * r.formule.price;

    dailyRevenueTemp[monthName][day - 1] += revenue;
    dailySalesTemp[monthName][day - 1] += 1;
  });
});


setDailyRevenue(dailyRevenueTemp);


        setDailyRevenue(dailyRevenueTemp);
      })
      .catch((err) => {
        console.error("Erreur chargement events:", err);
      });
  }, []);

  return (
    <>
      <PageMeta
        title="Dashboard Vendeur"
        description="Vue d'ensemble des performances vendeur"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/bussiness">
            <Card1 text="Nombre de business" value={businessCount} />
            </Link>           
            <Card1 icon={GroupIcon} text="Total de vente" value={`${totalSales} TND`} />

            <Link to="/admin/events">
            <Card1 text="Nombre des évènements" value={events.length} />
            </Link>           
                        <Link to="/admin/reservations">

            <Card1
              icon={GroupIcon}
              text="Nombre de réservations"
              value={reservationsCount}
              variation={8.2}
              trend="up"
              color="success"
            />
            </Link>
          </div>

        </div>
<div className="col-span-12">
  <StatisticsChart
    monthlySales={monthlySales}
    monthlyRevenue={monthlyRevenue}
  />
</div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlySalesChart />
          <MonthlyTarget />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>
      </div>
    </>
  );
}
