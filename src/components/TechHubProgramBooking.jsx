import React, { useState } from "react";
import { useAccount } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { WalletDefault } from "@coinbase/onchainkit/wallet";
import { Toaster, toast } from "sonner";
import { QrReader } from "react-qr-reader";

const programs = [
  {
    id: 1,
    name: "Software Engineering",
    description: "Learn to code and build applications",
    timeSlots: [
      "09:00 - 12:00",
      "12:00 - 15:00",
      "15:00 - 18:00",
      "18:00 - 21:00",
    ],
  },
  {
    id: 2,
    name: "Data Science",
    description: "Analyze and interpret complex data",
    timeSlots: ["10:00 - 13:00", "14:00 - 17:00"],
  },
  {
    id: 3,
    name: "Cybersecurity",
    description: "Protect systems and networks from digital attacks",
    timeSlots: ["09:30 - 12:30", "13:30 - 16:30"],
  },
  {
    id: 4,
    name: "AI & Machine Learning",
    description: "Develop intelligent systems and algorithms",
    timeSlots: ["11:00 - 14:00", "15:00 - 18:00"],
  },
];

const VerifierInterface = ({ onVerificationComplete }) => {
  const [scanning, setScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleScan = async (data) => {
    if (data) {
      setScanning(false);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const result = {
          isValid: Math.random() > 0.5,
          studentName: "John Doe",
          program: "Software Engineering",
          timeSlot: "09:00 - 12:00",
          expirationDate: new Date(Date.now() + 86400000).toISOString(),
        };
        setVerificationResult(result);
        onVerificationComplete(result);
      } catch (error) {
        console.error("Verification failed", error);
        setVerificationResult({ isValid: false, error: "Verification failed" });
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    toast.error("QR code scanning failed. Please try again.");
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Verifier Interface</h2>
      {!scanning && !verificationResult && (
        <Button onClick={() => setScanning(true)}>Start Scanning</Button>
      )}
      {scanning && (
        <div className="max-w-md mx-auto">
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%" }}
          />
        </div>
      )}
      {verificationResult && (
        <div className="mt-4">
          <h3 className="font-semibold">Verification Result:</h3>
          <p>Status: {verificationResult.isValid ? "Valid" : "Invalid"}</p>
          {verificationResult.isValid && (
            <>
              <p>Student: {verificationResult.studentName}</p>
              <p>Program: {verificationResult.program}</p>
              <p>Time Slot: {verificationResult.timeSlot}</p>
              <p>
                Expires:{" "}
                {new Date(verificationResult.expirationDate).toLocaleString()}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const TechHubProgramBooking = () => {
  const { address, isConnected } = useAccount();
  const [bookedPrograms, setBookedPrograms] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isVerifier, setIsVerifier] = useState(false);
  const [bookingStates, setBookingStates] = useState(
    programs.reduce(
      (acc, program) => ({
        ...acc,
        [program.id]: { isBooking: false, selectedTimeSlot: null },
      }),
      {}
    )
  );

  const toggleBooking = (programId) => {
    setBookingStates((prev) => ({
      ...prev,
      [programId]: {
        ...prev[programId],
        isBooking: !prev[programId].isBooking,
      },
    }));
  };

  const selectTimeSlot = (programId, timeSlot) => {
    setBookingStates((prev) => ({
      ...prev,
      [programId]: { ...prev[programId], selectedTimeSlot: timeSlot },
    }));
  };

  const bookProgram = (program) => {
    const ticket = {
      ...program,
      bookingDate: new Date().toISOString(),
      holderAddress: address,
      timeSlot: bookingStates[program.id].selectedTimeSlot,
    };
    setBookedPrograms([...bookedPrograms, ticket]);
    toggleBooking(program.id);
    toast.success(`Successfully booked ${program.name}`);
  };

  const generateTicketQR = (ticket) => {
    const ticketData = JSON.stringify(ticket);
    return (
      <div className="flex flex-col items-center">
        <QRCodeSVG value={ticketData} size={200} />
        <p className="mt-2 text-sm">Scan to verify</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex flex-wrap items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tech Hub Program Booking</h1>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            <Switch
              id="verifier-toggle"
              onCheckedChange={(checked) => setIsVerifier(checked)}
            />
            <label htmlFor="verifier-toggle" className="text-sm">
              {isVerifier ? "Verifier Mode" : "Student Mode"}
            </label>
          </div>
          <WalletDefault />
        </div>
      </nav>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="w-full">
            <CardHeader>
              <CardTitle>{program.name}</CardTitle>
              <CardDescription>{program.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  checked={bookingStates[program.id].isBooking}
                  onCheckedChange={() => toggleBooking(program.id)}
                />
                <span className="text-sm">Book Space</span>
              </div>
              {program.timeSlots && bookingStates[program.id].isBooking && (
                <div>
                  <p className="font-semibold mb-2 text-sm">
                    Select Time Slot:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {program.timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={
                          bookingStates[program.id].selectedTimeSlot === slot
                            ? "default"
                            : "outline"
                        }
                        onClick={() => selectTimeSlot(program.id, slot)}
                        className="text-xs"
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => bookProgram(program)}
                disabled={
                  !isConnected ||
                  !bookingStates[program.id].isBooking ||
                  (program.timeSlots &&
                    !bookingStates[program.id].selectedTimeSlot)
                }
                className="w-full"
              >
                Book Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {isConnected && bookedPrograms.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Your Booked Programs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookedPrograms.map((ticket, index) => (
              <Card key={index} className="w-full">
                <CardHeader>
                  <CardTitle>{ticket.name}</CardTitle>
                  <CardDescription>
                    Booked on:{" "}
                    {new Date(ticket.bookingDate).toLocaleDateString()}
                    {ticket.timeSlot && (
                      <>
                        <br />
                        Time: {ticket.timeSlot}
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setSelectedTicket(ticket)}
                        className="w-full"
                      >
                        View Ticket
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{ticket.name} Ticket</DialogTitle>
                        <DialogDescription>
                          Present this QR code for verification
                        </DialogDescription>
                      </DialogHeader>
                      {generateTicketQR(ticket)}
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!isConnected && (
        <div className="mt-12 text-center">
          <p className="text-lg">
            Please connect your wallet to book programs and view tickets.
          </p>
        </div>
      )}

      {isVerifier && (
        <VerifierInterface
          onVerificationComplete={(result) => {
            toast.success(
              `Verification ${result.isValid ? "successful" : "failed"}`
            );
          }}
        />
      )}

      <Toaster />
    </div>
  );
};

export default TechHubProgramBooking;
