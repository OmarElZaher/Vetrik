// TODO: Fix input boxes

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
	Box,
	Button,
	Card,
	FormControl,
	Input,
	InputGroup,
	InputRightElement,
	Icon,
	IconButton,
	Text,
	useToast,
} from "@chakra-ui/react";

import { MdOutlinePassword } from "react-icons/md";
import { PiPasswordBold } from "react-icons/pi";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

export default function ChangePassword() {
	const navigate = useNavigate();
	const toast = useToast();

	const [isLoading, setIsLoading] = useState(false);

	const [oldPassword, setOldPassword] = useState("");
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleChangePassword = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				"http://localhost:1234/user/changePassword",
				{
					oldPassword: oldPassword,
					newPassword: newPassword,
					confirmPassword: confirmPassword,
				},
				{ withCredentials: true }
			);

			if (response.status === 200) {
				toast({
					title: response.data.message,
					status: "success",
					duration: 2500,
					isClosable: true,
					position: "top",
				});

				try {
					setIsLoading(true);
					await axios.post(
						"http://localhost:1234/user/logout",
						{},
						{ withCredentials: true }
					);
					navigate("/login");
				} catch (error) {
					toast({
						title: error.response.data.message,
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				} finally {
					setIsLoading(false);
				}
			} else {
				toast({
					title: response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			}
		} catch (error) {
			toast({
				title: error.response.data.message,
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return isLoading ? (
		<Spinner />
	) : (
		<>
			<Box
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				height={"87vh"}
				bg={"#F3F3F3"}
			>
				<Card
					width={"80%"}
					height={"80%"}
					display={"flex"}
					justify={"center"}
					alignItems={"center"}
				>
					{/* Header */}
					<Box
						display={"flex"}
						justifyContent={"center"}
						flexDirection={"column"}
						alignItems={"center"}
						height={"15%"}
						mt={5}
					>
						<Icon as={MdOutlinePassword} fontSize={"40px"} />
						<Text fontSize={"40px"} fontWeight={"bold"}>
							Change Password
						</Text>
					</Box>

					{/* Body */}
					<Box
						display={"flex"}
						justifyContent={"center"}
						flexDirection={"column"}
						alignItems={"center"}
						height={"70%"}
						width={"90%"}
					>
						<FormControl
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							mb={5}
						>
							<InputGroup>
								{showOldPassword ? (
									<InputRightElement
										children={
											<IconButton
												bg={"#FFF"}
												as={FaEye}
												size={"xs"}
												cursor={"pointer"}
												_hover={{}}
												_active={{}}
												onClick={() => {
													setShowOldPassword(!showOldPassword);
												}}
											/>
										}
									/>
								) : (
									<InputRightElement
										children={
											<IconButton
												bg={"#FFF"}
												as={FaEyeSlash}
												size={"xs"}
												cursor={"pointer"}
												_hover={{}}
												_active={{}}
												onClick={() => {
													setShowOldPassword(!showOldPassword);
												}}
											/>
										}
									/>
								)}
								<Input
									type={showOldPassword ? "text" : "password"}
									value={oldPassword}
									placeholder='Old Password'
									onChange={(e) => {
										setOldPassword(e.target.value);
									}}
								/>
							</InputGroup>
						</FormControl>

						<FormControl
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							mb={5}
						>
							<InputGroup>
								{showNewPassword ? (
									<InputRightElement
										children={
											<IconButton
												bg={"#FFF"}
												as={FaEye}
												size={"xs"}
												cursor={"pointer"}
												_hover={{}}
												_active={{}}
												onClick={() => {
													setShowNewPassword(!showNewPassword);
												}}
											/>
										}
									/>
								) : (
									<InputRightElement
										children={
											<IconButton
												bg={"#FFF"}
												as={FaEyeSlash}
												size={"xs"}
												cursor={"pointer"}
												_hover={{}}
												_active={{}}
												onClick={() => {
													setShowNewPassword(!showNewPassword);
												}}
											/>
										}
									/>
								)}
								<Input
									type={showNewPassword ? "text" : "password"}
									value={newPassword}
									placeholder='New Password'
									onChange={(e) => {
										setNewPassword(e.target.value);
									}}
								/>
							</InputGroup>
						</FormControl>

						<FormControl
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
						>
							<InputGroup>
								{showConfirmPassword ? (
									<InputRightElement
										children={
											<IconButton
												bg={"#FFF"}
												as={FaEye}
												size={"xs"}
												cursor={"pointer"}
												_hover={{}}
												_active={{}}
												onClick={() => {
													setShowConfirmPassword(!showConfirmPassword);
												}}
											/>
										}
									/>
								) : (
									<InputRightElement
										children={
											<IconButton
												bg={"#FFF"}
												as={FaEyeSlash}
												size={"xs"}
												cursor={"pointer"}
												_hover={{}}
												_active={{}}
												onClick={() => {
													setShowConfirmPassword(!showConfirmPassword);
												}}
											/>
										}
									/>
								)}
								<Input
									type={showConfirmPassword ? "text" : "password"}
									value={confirmPassword}
									placeholder='Confirm Password'
									onChange={(e) => {
										setConfirmPassword(e.target.value);
									}}
								/>
							</InputGroup>
						</FormControl>
					</Box>

					{/* Submit Button */}
					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						height={"15%"}
					>
						<Button
							onClick={handleChangePassword}
							_hover={{
								bg: "yellowgreen",
								color: "#000",
								transform: "scale(1.01)",
							}}
							_active={{
								transform: "scale(0.99)",
								opacity: "0.5",
							}}
							leftIcon={<Icon as={PiPasswordBold} />}
						>
							{" "}
							Change Password
						</Button>
					</Box>
				</Card>
			</Box>
			<Footer />
		</>
	);
}
