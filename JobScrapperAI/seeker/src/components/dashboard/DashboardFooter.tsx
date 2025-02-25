import { Mails } from "lucide-react";

const DashboardFooter = () => {
  return (
    <footer className="bg-white p-10 border-t border-slate-300 flex fex-col justify-center">
      <div>
        {/* icons for the media */}
        <div>
          <div className="flex items-center">
            <Mails className="text-slate-700" />
            <span>contact</span>
          </div>
          <div>&copy; 2025 Seeker All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
