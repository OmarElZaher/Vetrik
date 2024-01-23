// React Imports
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ChakraUI Imports
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
	Icon,
	IconButton,
	useDisclosure,
} from "@chakra-ui/react";

import { HamburgerIcon } from "@chakra-ui/icons";

// Antd Imports
import { Flex } from "antd";

// React Icons Imports
import { CiEdit } from "react-icons/ci";
import { FaPerson } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { IoMdSearch, IoIosArrowDropdown } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { MdOutlinePassword, MdAdminPanelSettings } from "react-icons/md";

// Custom Component Imports
import NavigationLinkDrawer from "../../General/NavigationLinkDrawer";

export default function MyDrawerAdmin() {
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = useRef();

	// Hovered States
	const [isCloseHovered, setIsCloseHovered] = useState(false);
	const [isSearchHovered, setIsSearchHovered] = useState(false);
	const [isEditHovered, setIsEditHovered] = useState(false);
	const [isHomeHovered, setIsHomeHovered] = useState(false);
	const [isChangePasswordHovered, setIsChangePasswordHovered] = useState(false);
	const [isAddHovered, setIsAddHovered] = useState(false);

	// Open States
	const [isAddOpen, setIsAddOpen] = useState(false);

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
		} else if (type === "add") {
			setIsAddHovered(true);
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
		} else if (type === "add") {
			setIsAddHovered(false);
		}
	};

	return (
		<>
			<IconButton
				_hover={{ color: "#D4F500" }}
				onClick={onOpen}
				icon={<HamburgerIcon />}
				ref={btnRef}
				variant='transparent'
				size='xxl'
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
						color='#8F8F8F'
					/>
					<DrawerHeader
						color='#8F8F8F'
						fontSize='20px'
						textDecoration='underline'
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
										onClick={() => {
											navigate("/admin");
										}}
										justifyContent={"flex-start"}
										alignItems={"center"}
										transition='all 0.15s ease'
										bg='#121211'
										color='#8F8F8F'
										fontSize='18px'
										width='100%'
										leftIcon={
											<Icon
												as={GoHome}
												color={isHomeHovered ? "#000" : "#8F8F8F"}
											/>
										}
									>
										Home
									</Button>
								</Box>
							</Box>

							{/* Manage Users Button */}
							<Box>
								<Box
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
								>
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
										onClick={() => {
											navigate("/admin/search-users");
										}}
										justifyContent={"flex-start"}
										alignItems={"center"}
										transition='all 0.15s ease'
										bg='#121211'
										color='#8F8F8F'
										fontSize='18px'
										width='100%'
										leftIcon={
											<Icon
												as={IoMdSearch}
												color={isSearchHovered ? "#000" : "#8F8F8F"}
											/>
										}
									>
										Manage Users
									</Button>
								</Box>
							</Box>

							{/* Add User Button */}
							<Box>
								{/* Add Button */}
								<Box
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
								>
									<Button
										_hover={{
											bg: "#D4F500",
											borderColor: "#D4F500",
											color: "#000",
											transform: "scale(1.05)",
										}}
										_active={{
											transform: "scale(0.98)",
											opacity: "0.5",
										}}
										onMouseOver={() => {
											handleHover("add");
										}}
										onMouseOut={() => {
											handleMouseOut("add");
										}}
										onClick={() => {
											setIsAddOpen(!isAddOpen);
										}}
										justifyContent={"flex-start"}
										alignItems={"center"}
										transition='all 0.15s ease'
										bg='#121211'
										color='#8F8F8F'
										fontSize='20px'
										width='100%'
										leftIcon={
											<Icon
												as={IoAdd}
												color={isAddHovered ? "#000" : "#8F8F8F"}
											/>
										}
										rightIcon={
											<Icon
												as={IoIosArrowDropdown}
												fontSize='18px'
												color={isAddHovered ? "#000" : "#8F8F8F"}
												transform={
													isAddOpen ? "rotate(-180deg)" : "rotate(0deg)"
												}
												transition='transform 0.15s ease'
											/>
										}
									>
										Add
									</Button>
								</Box>

								{/* Additional Buttons For Add */}
								<Box>
									{isAddOpen ? (
										<Flex gap='middle' vertical align='center'>
											<Box
												display='flex'
												flexDirection='column'
												alignItems='flex-start'
												justifyContent='flex-start'
											>
												<NavigationLinkDrawer
													icon={FaPerson}
													text={"Create A User"}
													to={"/admin/create-user"}
													justifyContent='flex-end'
													alignItems='flex-start'
												/>

												<NavigationLinkDrawer
													icon={MdAdminPanelSettings}
													text={"Create An Admin"}
													to={"/admin/create-admin"}
													justifyContent='flex-end'
													alignItems='flex-start'
												/>
											</Box>
										</Flex>
									) : (
										<></>
									)}
								</Box>
							</Box>

							{/* Edit Profile Button */}
							<Box>
								<Box
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
								>
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
										onClick={() => {
											navigate("/edit-user");
										}}
										justifyContent={"flex-start"}
										alignItems={"center"}
										transition='all 0.15s ease'
										bg='#121211'
										color='#8F8F8F'
										fontSize='18px'
										width='100%'
										leftIcon={
											<Icon
												as={CiEdit}
												color={isEditHovered ? "#000" : "#8F8F8F"}
											/>
										}
									>
										Edit Profile
									</Button>
								</Box>
							</Box>

							{/* Change Password Button */}
							<Box>
								<Box
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
								>
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
										onClick={() => {
											navigate("/change-password");
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
