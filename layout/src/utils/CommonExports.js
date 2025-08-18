import { IoMdFootball } from "react-icons/io"
import { MdSportsCricket } from "react-icons/md"
import { CiBasketball } from "react-icons/ci"
import {
  GiBaseballBat,
  GiPingPongBat,
  GiBoxingGlove,
  GiRunningNinja,
  GiHockey,
  GiShuttlecock,
  GiRugbyConversion,
  GiDart,
  GiSoccerField,
} from "react-icons/gi"
import { FaTableTennis, FaVolleyballBall, FaFootballBall } from "react-icons/fa"
import { RiBilliardsLine } from "react-icons/ri"

export const SPORTS = [
  { key: "soccer", icon: IoMdFootball, color: "text-chart-5 bg-chart-5", sportNames: ["Soccer"] },
  { key: "cricket", icon: MdSportsCricket, color: "text-chart-1 bg-chart-1", sportNames: ["Cricket"] },
  { key: "basketball", icon: CiBasketball, color: "text-chart-2 bg-chart-2", sportNames: ["Basketball"] },
  { key: "baseball", icon: GiBaseballBat, color: "text-chart-6 bg-chart-6", sportNames: ["Baseball"] },
  { key: "tennis", icon: FaTableTennis, color: "text-chart-3 bg-chart-3", sportNames: ["Tennis"] },
  { key: "american_football", icon: FaFootballBall, color: "text-chart-4 bg-chart-4", sportNames: ["American Football"] },
  { key: "volleyball", icon: FaVolleyballBall, color: "text-chart-7 bg-chart-7", sportNames: ["Volleyball"] },
  { key: "table_tennis", icon: GiPingPongBat, color: "text-chart-8 bg-chart-8", sportNames: ["Table Tennis"] },
  { key: "mma", icon: GiBoxingGlove, color: "text-chart-9 bg-chart-9", sportNames: ["MMA"] },
  { key: "kabaddi", icon: GiRunningNinja, color: "text-chart-10 bg-chart-10", sportNames: ["Kabaddi"] },
  { key: "ice_hockey", icon: GiHockey, color: "text-chart-11 bg-chart-11", sportNames: ["Ice Hockey"] },
  { key: "badminton", icon: GiShuttlecock, color: "text-chart-12 bg-chart-12", sportNames: ["Badminton"] },
  { key: "rugby", icon: GiRugbyConversion, color: "text-chart-13 bg-chart-13", sportNames: ["Rugby"] },
  { key: "darts", icon: GiDart, color: "text-chart-14 bg-chart-14", sportNames: ["Darts"] },
  { key: "snooker", icon: RiBilliardsLine, color: "text-chart-15 bg-chart-15", sportNames: ["Snooker"] },
  { key: "futsal", icon: GiSoccerField, color: "text-chart-16 bg-chart-16", sportNames: ["Futsal"] },
]

export const SPORT_ID_BY_KEY = {
  basketball: "sr:sport:2",
  table_tennis: "sr:sport:20",
  soccer: "sr:sport:1",
  baseball: "sr:sport:3",
  mma: "sr:sport:117",
  kabaddi: "sr:sport:138",
  ice_hockey: "sr:sport:4",
  tennis: "sr:sport:5",
  cricket: "sr:sport:21",
  badminton: "sr:sport:31",
  american_football: "sr:sport:16",
  rugby: "sr:sport:12",
  darts: "sr:sport:22",
  volleyball: "sr:sport:23",
  snooker: "sr:sport:19",
  futsal: "sr:sport:29",
}