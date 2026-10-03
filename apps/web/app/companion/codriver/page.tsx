import { CompanionModule } from "../../components/CompanionModule";

export default function Page(){
  return <CompanionModule eyebrow="DRIVE" title="Co-Driver" description="Your virtual co-driver for delivery updates, trip announcements, driving reminders, and route events." items={["Voice Dispatcher","Delivery Updates","Trip Announcements","Rest Reminders","Route Events"]} />;
}
