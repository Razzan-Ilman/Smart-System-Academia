import Sidebar from '../../components/admin/Sidebar';
import StatsCard from '../../components/admin/StatsCard';
import CustomBarChart from '../../components/admin/CustomBarChart';
import icon from '../../images/icon.png';

const Dashboard = () => {
    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <Sidebar activePath="Home" />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                <main className="p-10 space-y-10">
                    {/* Top Row: Stats Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <StatsCard
                            type="profile"
                            image={icon}
                            name=""
                        />
                        <StatsCard
                            type="balance"
                            amount="5.000.000"
                        />
                    </div>

                    {/* Bottom Row: Chart Container */}
                    <div className="w-full">
                        <CustomBarChart />
                    </div>
                </main>
            </div>

            {/* Background Decorative Element */}
            <div className="fixed bottom-0 right-0 w-96 h-96 pointer-events-none z-0 opacity-10">
                <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-purple-200 to-transparent rounded-full blur-[100px]"></div>
            </div>
        </div>
    );
};

export default Dashboard;
