import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShippingDataStore } from "@/store/useShippingDataStore";

const COUNTRY_MULTIPLIERS = {
  Sweden: 7.35,
  China: 11.53,
  Brazil: 15.63,
  Australia: 50.09,
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const shippingFormSchema = z.object({
  receiverName: z
    .string()
    .trim()
    .min(1, "Receiver name is required")
    .regex(
      /^[a-zA-Z ]+$/,
      "Receiver name must only contain letters and spaces"
    ),
  weight: z
    .string()
    .min(1, "Weight is required")
    .transform((val) => Number(val))
    .refine((value) => !isNaN(value), {
      message: "Weight must be a valid number",
    })
    .refine((value) => value > 0, {
      message: "Weight must be a positive number",
    })
    .refine((value) => value >= 0.01, {
      message: "Weight must be at least 0.01 kg",
    }),
  boxColour: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  destinationCountry: z.enum(["Sweden", "China", "Brazil", "Australia"], {
    required_error: "Please select a destination country",
  }),
});

const ShippingForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      boxColour: "#000000",
    },
  });

  const selectedColor = watch("boxColour") || "#000000";

  const addShippingData = useShippingDataStore(
    (state) => state.addShippingData
  );

  const saveShippingData = async (data) => {
    const rgb = hexToRgb(data.boxColour);
    const boxColourRgb = `(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    const shippingCost =
      data.weight * COUNTRY_MULTIPLIERS[data.destinationCountry];

    const shippingData = {
      id: crypto.randomUUID(),
      receiverName: data.receiverName,
      weight: data.weight,
      boxColour: boxColourRgb,
      destinationCountry: data.destinationCountry,
      shippingCost: shippingCost.toFixed(2),
    };

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(shippingData),
        }
      );
      if (!response.ok) throw new Error("Failed to save data");
      return await response.json();
    } catch (error) {
      console.error("Error saving shipping data:", error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    try {
      const savedData = await saveShippingData(data);
      addShippingData(savedData);
      alert("Shipping data saved successfully!");
      reset({
        receiverName: "",
        weight: "",
        boxColour: "#000000",
        destinationCountry: "",
      });
    } catch (error) {
      alert("Failed to save shipping data. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Shipping Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Receiver Name */}
        <div className="space-y-2">
          <label htmlFor="receiverName" className="text-sm font-medium">
            Receiver Name
          </label>
          <Input
            id="receiverName"
            type="text"
            placeholder="Enter receiver name"
            {...register("receiverName")}
            className={errors.receiverName ? "border-destructive" : ""}
            aria-invalid={errors.receiverName ? "true" : "false"}
          />
          {errors.receiverName && (
            <p className="text-sm text-destructive">
              {errors.receiverName.message}
            </p>
          )}
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <label htmlFor="weight" className="text-sm font-medium">
            Weight (kg)
          </label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Enter weight in kilograms"
            {...register("weight")}
            className={errors.weight ? "border-destructive" : ""}
            aria-invalid={errors.weight ? "true" : "false"}
          />
          {errors.weight && (
            <p className="text-sm text-destructive">{errors.weight.message}</p>
          )}
        </div>

        {/* Box Colour */}
        <div className="space-y-2">
          <label htmlFor="boxColour" className="text-sm font-medium">
            Box Colour
          </label>
          <div className="flex items-center gap-4">
            <Input
              id="boxColour"
              type="color"
              {...register("boxColour")}
              className={`h-12 w-24 cursor-pointer ${
                errors.boxColour ? "border-destructive" : ""
              }`}
              aria-invalid={errors.boxColour ? "true" : "false"}
            />
            <div className="flex-1">
              <Input
                type="text"
                value={
                  hexToRgb(selectedColor)
                    ? `RGB(${hexToRgb(selectedColor).r}, ${
                        hexToRgb(selectedColor).g
                      }, ${hexToRgb(selectedColor).b})`
                    : "Invalid color"
                }
                readOnly
                placeholder="RGB(0, 0, 0)"
                className="bg-muted"
              />
            </div>
          </div>
          {errors.boxColour && (
            <p className="text-sm text-destructive">
              {errors.boxColour.message}
            </p>
          )}
        </div>

        {/* Destination Country */}
        <div className="space-y-2">
          <label htmlFor="destinationCountry" className="text-sm font-medium">
            Destination Country
          </label>
          <Controller
            name="destinationCountry"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                aria-invalid={errors.destinationCountry ? "true" : "false"}
              >
                <SelectTrigger
                  className={
                    errors.destinationCountry
                      ? "w-full border-destructive"
                      : "w-full"
                  }
                >
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sweden">Sweden (7.35 INR/kg)</SelectItem>
                  <SelectItem value="China">China (11.53 INR/kg)</SelectItem>
                  <SelectItem value="Brazil">Brazil (15.63 INR/kg)</SelectItem>
                  <SelectItem value="Australia">
                    Australia (50.09 INR/kg)
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.destinationCountry && (
            <p className="text-sm text-destructive">
              {errors.destinationCountry.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
};

export default ShippingForm;
