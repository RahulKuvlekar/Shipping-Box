import React, { useEffect, useState } from "react";
import {
  Table,
  TableCaption,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useShippingDataStore } from "@/store/useShippingDataStore";

const DetailsTable = () => {
  const [status, setStatus] = useState("loading"); // loading, completed, error
  const [error, setError] = useState(null); // error message

  const shippingData = useShippingDataStore((state) => state.shippingData);

  const getShippingData = async () => {
    try {
      setStatus("loading");
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to get shipping data");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting shipping data:", error);
      setError(error);
    } finally {
      setStatus("completed");
    }
  };

  useEffect(() => {
    getShippingData();
  }, []);

  return (
    <div>
      {(() => {
        if (status === "loading") {
          return (
            <div className="flex flex-col items-center justify-center min-h-40 py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-700 mb-3"></div>
              <span className="text-gray-700 text-base font-medium">
                Loading shipping details...
              </span>
            </div>
          );
        }
        if (error) {
          return (
            <div className="flex flex-col items-center justify-center min-h-40 py-8">
              <span className="text-red-700 text-base font-medium">
                Error: {error || "Something went wrong"}
              </span>
            </div>
          );
        }
        if (status === "completed") {
          return (
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[700px] border border-gray-300 rounded-md bg-gray-100 text-sm md:text-base">
                <TableHeader>
                  <TableRow className="bg-white">
                    <TableHead className="md:w-[160px] w-[100px] md:min-w-[140px] min-w-[100px]  text-xs md:text-base font-semibold">
                      Receiver Name
                    </TableHead>
                    <TableHead className="md:w-[120px] w-[80px] md:min-w-[100px] min-w-[70px] text-xs md:text-base font-semibold">
                      Weight (kg)
                    </TableHead>
                    <TableHead className="md:w-[80px] w-[60px] md:min-w-[80px] min-w-[60px] text-xs md:text-base font-semibold">
                      Box Colour
                    </TableHead>
                    <TableHead className="md:w-[180px] w-[120px] md:min-w-[150px] min-w-[110px] text-xs md:text-base font-semibold">
                      Destination Country
                    </TableHead>
                    <TableHead className="md:w-[160px] w-[100px] md:min-w-[120px] min-w-[90px] text-xs md:text-base font-semibold">
                      Shipping Cost (INR)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shippingData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No shipping data found
                      </TableCell>
                    </TableRow>
                  ) : (
                    shippingData.map((data) => {
                      return (
                        <TableRow
                          key={data.id}
                          className="text-xs md:text-base"
                        >
                          <TableCell>{data.receiverName}</TableCell>
                          <TableCell>{data.weight}</TableCell>
                          <TableCell>
                            <div
                              className="w-7 h-7 rounded border border-gray-400 inline-block mr-2 align-middle"
                              style={{
                                backgroundColor: `rgb${data.boxColour}`,
                              }}
                              title={`RGB${data.boxColour}`}
                            />
                          </TableCell>
                          <TableCell>{data.destinationCountry}</TableCell>
                          <TableCell>{data.shippingCost} ₹</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          );
        }
      })()}
    </div>
  );
};

export default DetailsTable;
