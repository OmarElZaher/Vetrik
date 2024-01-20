import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	IconButton,
	useDisclosure,
	Icon,
} from "@chakra-ui/react";

import { Flex } from "antd";

import { HamburgerIcon } from "@chakra-ui/icons";

import { IoMdSearch } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { GoHome } from "react-icons/go";
import { MdOutlinePassword } from "react-icons/md";

export default function MyDrawerAdmin() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = useRef();

	const [isCloseHovered, setIsCloseHovered] = useState(false);
	const [isSearchHovered, setIsSearchHovered] = useState(false);
	const [isEditHovered, setIsEditHovered] = useState(false);
	const [isHomeHovered, setIsHomeHovered] = useState(false);
	const [isChangePasswordHovered, setIsChangePasswordHovered] = useState(false);

	const handleHover = (type) => {
		if (type === "close") {
			setIsCloseHovered(true);
		} else if (type === "search") {
			setIsSearchHovered(true);
		} else if (type === "edit") {
			setIsEditHovered(true);
		} else if (type === "home") {
			setIsHomeHovered(true);
		} else if (type === "changePassword") {
			setIsChangePasswordHovered(true);
		}
	};

	const handleMouseOut = (type) => {
		if (type === "close") {
			setIsCloseHovered(false);
		} else if (type === "search") {
			setIsSearchHovered(false);
		} else if (type === "edit") {
			setIsEditHovered(false);
		} else if (type === "home") {
			setIsHomeHovered(false);
		} else if (type === "changePassword") {
			setIsChangePasswordHovered(false);
		}
	};

	return (
		<>
			<IconButton
				icon={<HamburgerIcon />}
				onClick={onOpen}
				ref={btnRef}
				variant='transparent'
				size='xxl'
				_hover={{ color: "#D4F500" }}
				width='50px'
				height='50px'
			/>

			<Drawer
				isOpen={isOpen}
				placement='left'
				onClose={onClose}
				finalFocusRef={btnRef}
			>
				<DrawerOverlay />
				<DrawerContent bg='#121211'>
					<DrawerCloseButton
						color='#8F8F8F'
						_hover={{
							color: "#D4F500",
							transform: isCloseHovered ? "rotate(90deg)" : "rotate(0deg)",
							transition: "transform 0.3s ease",
						}}
						onMouseOver={() => {
							handleHover("close");
						}}
						onMouseOut={() => {
							handleMouseOut("close");
						}}
					/>
					<DrawerHeader
						color='#8F8F8F'
						fontSize='20px'
						textDecoration='underline'
						pl='20px'
					>
						Menu
					</DrawerHeader>

					<DrawerBody>
						<Flex gap='middle' vertical>
							{/* Home Button */}
							<Box>
								<Box
									display={"flex"}
									justifyContent={"flex-start"}
									alignItems={"center"}
								>
									<Link to={"/admin"}>
										<Button
											_hover={{
												bg: "#D4F500",
												borderColor: "#D4F500",
												color: "#000",
												transform: "scale(1.05)",
											}}
											onMouseOver={() => {
												handleHover("home");
											}}
											onMouseOut={() => {
												handleMouseOut("home");
											}}
											_active={{
												transform: "scale(0.98)",
												opacity: "0.5",
											}}
											justifyContent={"flex-start"}
											alignItems={"center"}
											transition='all 0.15s ease'
											bg='#121211'
											color='#8F8F8F'
											fontSize='18px'
											width='272px'
											leftIcon={
												<Icon
													as={GoHome}
													color={isHomeHovered ? "#000" : "#8F8F8F"}
												/>
											}
										>
											Home
										</Button>
									</Link>
								</Box>
							</Box>

							{/* Search Users Button */}
							<Box>
								<Box
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
								>
									<Link to={"/admin/search-users"}>
										<Button
											_hover={{
												bg: "#D4F500",
												borderColor: "#D4F500",
												color: "#000",
												transform: "scale(1.05)",
											}}
											onMouseOver={() => {
												handleHover("search");
											}}
											onMouseOut={() => {
												handleMouseOut("search");
											}}
											_active={{
												transform: "scale(0.98)",
												opacity: "0.5",
											}}
											justifyContent={"flex-start"}
											alignItems={"center"}
											transition='all 0.15s ease'
											bg='#121211'
											color='#8F8F8F'
											fontSize='18px'
											width='272px'
											leftIcon={
												<Icon
													as={IoMdSearch}
													color={isSearchHovered ? "#000" : "#8F8F8F"}
												/>
											}
										>
											Search Users
										</Button>
									</Link>
								</Box>
							</Box>

							{/* Edit Profile Button */}
							<Box>
								<Box
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
								>
									<Link to={"/edit-user"}>
										<Button
											_hover={{
												bg: "#D4F500",
												borderColor: "#D4F500",
												color: "#000",
												transform: "scale(1.05)",
											}}
											onMouseOver={() => {
												handleHover("edit");
											}}
											onMouseOut={() => {
												handleMouseOut("edit");
											}}
											_active={{
												transform: "scale(0.98)",
												opacity: "0.5",
											}}
											justifyContent={"flex-start"}
											alignItems={"center"}
											transition='all 0.15s ease'
											bg='#121211'
											color='#8F8F8F'
											fontSize='18px'
											width='272px'
											leftIcon={
												<Icon
													as={CiEdit}
													color={isEditHovered ? "#000" : "#8F8F8F"}
												/>
											}
										>
											Edit Profile
										</Button>
									</Link>
								</Box>
							</Box>

							{/* Change Password Button */}
							<Box>
								<Box
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
								>
									<Link to={"/change-password"}>
										<Button
											_hover={{
												bg: "#D4F500",
												borderColor: "#D4F500",
												color: "#000",
												transform: "scale(1.05)",
											}}
											onMouseOver={() => {
												handleHover("changePassword");
											}}
											onMouseOut={() => {
												handleMouseOut("changePassword");
											}}
											_active={{
												transform: "scale(0.98)",
												opacity: "0.5",
											}}
											justifyContent={"flex-start"}
											alignItems={"center"}
											transition='all 0.15s ease'
											bg='#121211'
											color='#8F8F8F'
											fontSize='18px'
											width='272px'
											leftIcon={
												<Icon
													as={MdOutlinePassword}
													color={isChangePasswordHovered ? "#000" : "#8F8F8F"}
												/>
											}
										>
											Change Password
										</Button>
									</Link>
								</Box>
							</Box>
						</Flex>
					</DrawerBody>

					<DrawerFooter color='#8F8F8F'>® Modern Vet Clinic</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	);
}
