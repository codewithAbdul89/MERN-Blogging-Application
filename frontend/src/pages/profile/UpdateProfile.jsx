import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  FiCamera,
  FiCheck,
  FiEdit2,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ButtonLoader from "../../components/ui/ButtonLoader";
import Select from "../../components/ui/Select";

import { useCountries, useStates, useCities } from "../../features/location/locationQueries";

import {
  bioValidationSchema,
  profilePictureSchema,
  updateProfileSchema,
} from "../../features/user/userValidation";

import {
  useUpdateProfile,
  useUpdateProfilePicture,
  useRemoveProfilePicture,
  useUpdateBio,
} from "../../features/user/userMutations";
import { showError } from "../../utils/toast";
import Avatar from "../../components/ui/Avatar";
import { useLocation, useNavigate } from "react-router-dom";
import { setUser } from "../../features/auth/authSlice.js";

function UpdateProfile() {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useDispatch();
  // MUTATIONS

  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();

  const { mutateAsync: updateProfilePicture, isPending: isUpdatingPicture } =
    useUpdateProfilePicture();

  const { mutateAsync: removeProfilePicture, isPending: isDeletingPicture } =
    useRemoveProfilePicture();

  const { mutateAsync: updateBio, isPending: isBioUpdatePending } = useUpdateBio();

  // PROFILE FORM

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // PROFILE PICTURE FORM

  const {
    register: registerPicture,
    handleSubmit: handlePictureSubmit,
    watch: watchPicture,
    reset: resetPicture,
    formState: { errors: pictureErrors },
  } = useForm({
    resolver: zodResolver(profilePictureSchema),

    defaultValues: {
      avatar: undefined,
    },
  });

  // Bio's Form

  const {
    register: bioRegister,
    handleSubmit: handleBioSubmit,
    formState: { errors: bioError, isDirty: bioDirty },
  } = useForm({
    resolver: zodResolver(bioValidationSchema),
    defaultValues: {
      bio: user?.bio || "",
    },
  });

  const onBioSubmit = async (data) => {
    if (!bioDirty) {
      return showError("Please make some changes to your bio first.");
    }
    await updateBio({
      bio: data.bio,
    });
  };

  // SELECTED LOCATION

  const selectedCountry = watch("country");

  const selectedProvince = watch("province");

  const {
    data: countriesData = [],
    isPending: isCountriesPending,
    isError: isCountriesError,
  } = useCountries();

  // STATES / PROVINCES

  const {
    data: statesData = [],
    isPending: isStatesPending,
    isError: isStatesError,
  } = useStates(selectedCountry);

  // CITIES

  const {
    data: citiesData = [],
    isPending: isCitiesPending,
    isError: isCitiesError,
  } = useCities({
    countryCode: selectedCountry,
    stateCode: selectedProvince,
  });

  // POPULATE EXISTING USER DATA
  const countries = countriesData ?? [];

  const states = statesData ?? [];

  const cities = citiesData ?? [];
  // set the previous data of user
  useEffect(() => {
    if (!user) return;

    reset({
      userName: user.userName ?? "",
      contact: user.contact ?? "",
      cnic: user.cnic ?? "",
      gender: user.gender ?? "",
      country: "",
      province: "",
      city: "",
      town: user.address?.town ?? "",
    });
  }, [user, reset]);

  // set the previous country of user
  useEffect(() => {
    if (!user || !countries.length) return;

    const savedCountry = user.address?.country ?? "";

    if (!savedCountry) return;

    const country = countries.find(
      (item) =>
        item.iso2?.toLowerCase() === savedCountry.toLowerCase() ||
        item.name?.toLowerCase() === savedCountry.toLowerCase()
    );

    if (country) {
      setValue("country", country.iso2, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [user, countries, setValue]);
  // set the previous state of user
  useEffect(() => {
    if (!user || !selectedCountry || !states.length) return;

    const savedProvince = user.province ?? user.address?.province ?? "";

    if (!savedProvince) return;

    const province = states.find(
      (item) =>
        item.iso2?.toLowerCase() === savedProvince.toLowerCase() ||
        item.name?.toLowerCase() === savedProvince.toLowerCase()
    );

    if (province) {
      setValue("province", province.iso2, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [user, selectedCountry, states, setValue]);
  // set the previous city of user
  useEffect(() => {
    if (!user || !selectedCountry || !selectedProvince || !cities.length) {
      return;
    }

    const savedCity = user.city ?? user.address?.city ?? "";

    if (!savedCity) return;

    const city = cities.find((item) => item.name?.toLowerCase() === savedCity.toLowerCase());

    if (city) {
      setValue("city", city.name, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [user, selectedCountry, selectedProvince, cities, setValue]);

  const countryOptions = countries.map((country) => ({
    value: country.iso2,
    label: country.name,
  }));

  const provinceOptions = states.map((state) => ({
    value: state.iso2,
    label: state.name,
  }));

  const cityOptions = cities.map((city) => ({
    value: city.name,
    label: city.name,
  }));

  // PROFILE PICTURE

  const avatarFiles = watchPicture("avatar");

  const selectedImage = avatarFiles?.[0] ?? null;

  // IMAGE PREVIEW

  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage]);

  const currentProfileImage = previewUrl || user?.profilePic?.url || "";
  const hasProfileImage = Boolean(user?.profilePic?.url !== "");

  // UPDATE PROFILE PICTURE

  const handleUpdatePicture = async (data) => {
    const file = data.avatar?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("avatar", file);

    await updateProfilePicture(formData);

    resetPicture();
  };

  // CANCEL SELECTED PICTURE

  const handleCancelPicture = () => {
    resetPicture();
  };

  // REMOVE PROFILE PICTURE

  const handleRemovePicture = async () => {
    await removeProfilePicture();
  };

  // UPDATE PROFILE

  const onSubmit = async (data) => {
    if (!isDirty) {
      showError("Nothing to update.At least one new field is required.");
      return;
    }
    const selectedCountry = countries.find((country) => country.iso2 === data.country);

    const selectedProvince = states.find((state) => state.iso2 === data.province);

    const selectedCity = cities.find((city) => city.name === data.city);

    const profileData = {
      ...data,

      country: selectedCountry?.name ?? "",
      province: selectedProvince?.name ?? "",
      city: selectedCity?.name ?? "",
    };

    const response = await updateProfile(profileData);

    dispatch(setUser(response.data.user));
    const from = location.state?.from;

    navigate(from || "/dashboard", {
      replace: true,
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* PAGE HEADER */}

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
            <FiUser size={21} />
          </div>

          <div>
            <h1 className="font-heading text-primary text-3xl font-bold sm:text-3xl">
              Update Profile
            </h1>

            <p className="text-text-secondary mt-1 text-sm">
              Manage your personal information and profile picture.
            </p>
          </div>
        </div>
      </div>

      {/* PROFILE PICTURE */}

      <section
        id="avatar"
        className="border-border bg-surface overflow-hidden rounded-2xl border shadow-sm"
      >
        {/* Header */}

        <div className="border-border border-b px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <FiCamera size={19} />
            </div>

            <div>
              <h2 className="text-text-primary font-semibold">Profile Picture</h2>

              <p className="text-text-secondary mt-0.5 text-xs sm:text-sm">
                Choose a picture that represents your profile.
              </p>
            </div>
          </div>
        </div>

        {/* Picture Form */}

        <form onSubmit={handlePictureSubmit(handleUpdatePicture)} className="p-5 sm:p-6">
          <div className="flex flex-col items-center gap-10 sm:flex-row">
            {/* Image */}

            <div className="relative shrink-0">
              <div className="border-primary/10 bg-primary/5 ring-border/50 h-50 w-50 overflow-hidden rounded-full border-4 shadow-lg ring-1 sm:h-36 sm:w-36">
                <Avatar
                  src={currentProfileImage}
                  className="h-full w-full object-cover text-5xl"
                  userName={user?.userName}
                />
              </div>

              {/* Camera / Edit Button */}

              <label
                htmlFor="profile-avatar-input"
                aria-label="Choose profile picture"
                className="border-surface bg-primary hover:bg-primary-hover absolute right-0 bottom-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 text-white shadow-md transition hover:scale-105"
              >
                <FiEdit2 size={17} />
              </label>
            </div>

            {/* Image Information */}

            <div className="w-full text-center sm:text-left">
              <h3 className="text-text-primary text-lg font-semibold">
                {user?.userName || "Your Profile Picture"}
              </h3>

              <p className="text-text-secondary mt-1 text-sm">JPG, PNG or WEBP</p>

              <p className="text-text-muted mt-1 text-xs">Maximum file size: 2 MB</p>

              {/* Hidden File Input */}

              <input
                id="profile-avatar-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                {...registerPicture("avatar")}
              />

              {/* Validation Error */}

              {pictureErrors.avatar && (
                <p className="text-danger mt-3 text-sm font-medium">
                  {pictureErrors.avatar.message}
                </p>
              )}

              {/* Selected Image */}

              {selectedImage && !pictureErrors.avatar && (
                <div className="border-primary/20 bg-primary/5 mt-4 rounded-xl border p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-text-primary truncate text-sm font-medium">
                        {selectedImage.name}
                      </p>

                      <p className="text-text-secondary mt-1 text-xs">
                        {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        type="submit"
                        disabled={isUpdatingPicture}
                        text={
                          isUpdatingPicture ? (
                            <ButtonLoader text="Updating" />
                          ) : (
                            <>
                              <FiCheck className="mr-2 inline" />
                              Update Picture
                            </>
                          )
                        }
                        className="bg-primary hover:bg-primary-hover text-white"
                      />

                      <Button
                        type="button"
                        onClick={handleCancelPicture}
                        disabled={isUpdatingPicture}
                        text="Cancel"
                        className="border-border bg-background text-text-primary hover:bg-background/70 border"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Default Actions */}

              {!selectedImage && (
                <div className="mt-4 flex flex-wrap justify-center gap-4 sm:justify-start">
                  {/* Choose Picture */}

                  <label
                    htmlFor="profile-avatar-input"
                    className="bg-primary hover:bg-primary-hover inline-flex w-45 cursor-pointer items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white transition"
                  >
                    <FiCamera className="mr-2" />
                    Choose Picture
                  </label>

                  {/* Remove Picture */}

                  {hasProfileImage && (
                    <Button
                      type="button"
                      onClick={handleRemovePicture}
                      disabled={isDeletingPicture}
                      text={
                        isDeletingPicture ? (
                          <ButtonLoader text="Removing" />
                        ) : (
                          <>
                            <FiTrash2 className="mr-2 inline" />
                            Delete Avatar
                          </>
                        )
                      }
                      className="border-danger/30 bg-danger/5 text-danger hover:bg-danger/10 w-45 border"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      </section>

      {/* Bio Section */}
      <section className="border-border bg-surface mt-6 overflow-hidden rounded-2xl border py-5 shadow-sm">
        <h2 className="text-text-primary text px-4 font-semibold sm:px-9">
          {user?.bio ? "Update Bio" : "Add Bio"}
        </h2>
        <form onSubmit={handleBioSubmit(onBioSubmit)} className="sm:px-6">
          <div className="p-3">
            <textarea
              className="border-border bg-surface text-text-primary placeholder:text-text-placeholder focus:border-primary focus:ring-primary/20 min-h-34 w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-80 sm:min-h-24"
              {...bioRegister("bio")}
              placeholder={
                !user?.bio ? "You haven't added a bio yet. Place your bio here." : undefined
              }
            ></textarea>
            {bioError?.bio && (
              <p className="text-danger p-2 text-sm sm:p-1">{bioError?.bio?.message}</p>
            )}
          </div>

          <div className="flex justify-end px-8 pb-3">
            <Button
              type="Submit"
              disabled={isBioUpdatePending}
              className="bg-primary hover:bg-primary-hover w-full px-5 text-white sm:w-36"
              text={
                isBioUpdatePending ? (
                  <ButtonLoader text="Updating" />
                ) : user.bio ? (
                  "Update Bio"
                ) : (
                  "Add Bio"
                )
              }
            />
          </div>
        </form>
      </section>

      {/* PERSONAL INFORMATION */}

      <section className="border-border bg-surface mt-6 overflow-hidden rounded-2xl border shadow-sm">
        {/* Header */}

        <div className="border-border border-b px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <FiUser size={19} />
            </div>

            <div>
              <h2 className="text-text-primary font-semibold">Personal Information</h2>

              <p className="text-text-secondary mt-0.5 text-xs sm:text-sm">
                Keep your account information up to date.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-6">
          {/* ============================================================
              BASIC INFORMATION
          ============================================================ */}

          <div>
            <div className="mb-4">
              <h3 className="text-text-secondary text-sm font-semibold tracking-wide uppercase">
                Basic Information
              </h3>

              <div className="bg-border mt-2 h-px" />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Username */}

              <Input
                label="Username"
                id="userName"
                placeholder="Enter your username"
                {...register("userName")}
                error={errors.userName?.message}
              />

              {/* Email */}

              <div>
                <Input
                  label="Email"
                  id="email"
                  value={user?.email ?? ""}
                  disabled
                  className="cursor-not-allowed bg-gray-300 opacity-60"
                />

                <p className="text-text-muted mt-1.5 flex items-center gap-1 text-xs">
                  <FiMail size={12} />
                  Email cannot be changed here.
                </p>
              </div>

              {/* Contact */}

              <div>
                <Input
                  label="Contact"
                  id="contact"
                  placeholder="Enter your contact number"
                  inputMode="numeric"
                  {...register("contact")}
                  error={errors.contact?.message}
                />

                <p className="text-text-muted mt-1.5 flex items-center gap-1 text-xs">
                  <FiPhone size={12} />
                  Numbers only.
                </p>
              </div>

              {/* CNIC */}

              <Input
                label="CNIC"
                id="cnic"
                placeholder="Enter your CNIC"
                inputMode="numeric"
                maxLength={13}
                {...register("cnic")}
                error={errors.cnic?.message}
              />

              {/* Gender */}

              <div>
                <label
                  htmlFor="gender"
                  className="text-text-primary mb-2 block text-sm font-medium"
                >
                  Gender
                </label>

                <Select
                  id="gender"
                  {...register("gender")}
                  options={[
                    {
                      value: "Male",
                      label: "Male",
                    },
                    {
                      value: "Female",
                      label: "Female",
                    },
                    {
                      value: "Other",
                      label: "Other",
                    },
                  ]}
                  placeholder="Select gender"
                  error={errors.gender?.message}
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {/* ============================================================
              ADDRESS
          ============================================================ */}

          <div className="border-border mt-8 border-t pt-7">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <FiMapPin className="text-primary" size={17} />

                <h3 className="text-text-secondary text-sm font-semibold tracking-wide uppercase">
                  Address
                </h3>
              </div>

              <div className="bg-border mt-2 h-px" />

              <p className="text-text-muted mt-2 text-xs">
                Select your country first, then your state/province and city.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* ==========================================================
                  COUNTRY
              ========================================================== */}

              <div>
                <label
                  htmlFor="country"
                  className="text-text-primary mb-2 block text-sm font-medium"
                >
                  Country
                </label>

                <Select
                  id="country"
                  {...register("country", {
                    onChange: () => {
                      setValue("province", "", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });

                      setValue("city", "", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    },
                  })}
                  options={countryOptions}
                  placeholder={isCountriesPending ? "Loading countries..." : "Select country"}
                  disabled={isCountriesPending || isCountriesError}
                  error={errors.country?.message}
                  className="h-12"
                />

                {isCountriesError && (
                  <p className="text-danger mt-1.5 text-xs">Unable to load countries.</p>
                )}
              </div>

              {/* ==========================================================
                  PROVINCE
              ========================================================== */}

              <div>
                <label
                  htmlFor="province"
                  className="text-text-primary mb-2 block text-sm font-medium"
                >
                  State / Province
                </label>

                <Select
                  id="province"
                  {...register("province", {
                    onChange: () => {
                      setValue("city", "", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    },
                  })}
                  options={provinceOptions}
                  placeholder={
                    !selectedCountry
                      ? "Select country first"
                      : isStatesPending
                        ? "Loading states..."
                        : "Select state / province"
                  }
                  disabled={!selectedCountry || isStatesPending || isStatesError}
                  error={errors.province?.message}
                  className="h-12"
                />

                {isStatesError && (
                  <p className="text-danger mt-1.5 text-xs">Unable to load states/provinces.</p>
                )}
              </div>

              {/* ==========================================================
                  CITY
              ========================================================== */}

              <div>
                <label htmlFor="city" className="text-text-primary mb-2 block text-sm font-medium">
                  City
                </label>

                <Select
                  id="city"
                  {...register("city")}
                  options={cityOptions}
                  placeholder={
                    !selectedProvince
                      ? "Select state / province first"
                      : isCitiesPending
                        ? "Loading cities..."
                        : "Select city"
                  }
                  disabled={!selectedProvince || isCitiesPending || isCitiesError}
                  error={errors.city?.message}
                  className="h-12"
                />

                {isCitiesError && (
                  <p className="text-danger mt-1.5 text-xs">Unable to load cities.</p>
                )}
              </div>

              {/* ==========================================================
                  TOWN
              ========================================================== */}

              <Input
                label="Town"
                id="town"
                placeholder="Enter your town"
                labelClassName="my-0.5"
                {...register("town")}
                className="h-12"
                error={errors.town?.message}
              />
            </div>
          </div>

          {/* ============================================================
              SAVE BUTTON
          ============================================================ */}

          <div className="border-border mt-8 flex justify-end border-t pt-6">
            <Button
              type="submit"
              disabled={isUpdatingProfile}
              text={
                isUpdatingProfile ? (
                  <ButtonLoader text="Saving" />
                ) : (
                  <>
                    <FiCheck className="mr-2 inline" />
                    Save Changes
                  </>
                )
              }
              className="bg-primary hover:bg-primary-hover w-full text-white sm:w-auto"
            />
          </div>
        </form>
      </section>
    </div>
  );
}

export default UpdateProfile;
