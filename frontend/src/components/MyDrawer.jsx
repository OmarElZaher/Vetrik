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
import { IoAdd } from "react-icons/io5";
import { FaPerson } from "react-icons/fa6";
import { MdOutlinePets } from "react-icons/md";
import { IoIosArrowDropdown } from "react-icons/io";
import { CiEdit } from "react-icons/ci";

import NavigationLinkDrawer from "./NavigationLinkDrawer";

export default function MyDrawer() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = useRef();

	const [isCloseHovered, setIsCloseHovered] = useState(false);
	const [isSearchHovered, setIsSearchHovered] = useState(false);
	const [isAddHovered, setIsAddHovered] = useState(false);
	const [isEditHovered, setIsEditHovered] = useState(false);

	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isAddOpen, setIsAddOpen] = useState(false);

	const handleHover = (type) => {
		if (type === "close") {
			setIsCloseHovered(true);
		} else if (type === "search") {
			setIsSearchHovered(true);
		} else if (type === "add") {
			setIsAddHovered(true);
		} else if (type === "edit") {
			setIsEditHovered(true);
		}
	};

	const handleMouseOut = (type) => {
		if (type === "close") {
			setIsCloseHovered(false);
		} else if (type === "search") {
			setIsSearchHovered(false);
		} else if (type === "add") {
			setIsAddHovered(false);
		} else if (type === "edit") {
			setIsEditHovered(false);
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
							{/* Search Accordion */}
							<Box>
								{/* Search Button */}
								<Box
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
								>
									<Button
										onClick={() => {
											if (isAddOpen) {
												setIsAddOpen(!isAddOpen);
											}
											setIsSearchOpen(!isSearchOpen);
										}}
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
											handleHover("search");
										}}
										onMouseOut={() => {
											handleMouseOut("search");
										}}
										justifyContent={"flex-start"}
										alignItems={"center"}
										transition='all 0.15s ease'
										bg='#121211'
										color='#8F8F8F'
										width='272px'
										fontSize='20px'
										leftIcon={
											<Icon
												as={IoMdSearch}
												color={isSearchHovered ? "#000" : "#8F8F8F"}
											/>
										}
										rightIcon={
											<Icon
												as={IoIosArrowDropdown}
												fontSize='18px'
												color={isSearchHovered ? "#000" : "#8F8F8F"}
												transform={
													isSearchOpen ? "rotate(-180deg)" : "rotate(0deg)"
												}
												transition='transform 0.15s ease'
											/>
										}
									>
										Search
									</Button>
								</Box>

								{/* Additional Buttons For Search */}
								<Box>
									{isSearchOpen ? (
										<Flex gap='middle' vertical align='center'>
											<Box
												display='flex'
												flexDirection='column'
												alignItems='flex-start'
												justifyContent='flex-start'
											>
												<NavigationLinkDrawer
													icon={FaPerson}
													text={"Search For An Owner"}
													to={"/search-owner"}
													justifyContent='flex-end'
													alignItems='center'
												/>

												<NavigationLinkDrawer
													icon={MdOutlinePets}
													text={"Search For A Pet"}
													to={"/search-pet"}
													justifyContent='flex-end'
													alignItems='center'
												/>
											</Box>
										</Flex>
									) : (
										<></>
									)}
								</Box>
							</Box>

							{/* Add Accordion */}
							<Box>
								{/* Add Button */}
								<Box
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
								>
									<Button
										onClick={() => {
											if (isSearchOpen) {
												setIsSearchOpen(!isSearchOpen);
											}

											setIsAddOpen(!isAddOpen);
										}}
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
										justifyContent={"flex-start"}
										alignItems={"center"}
										transition='all 0.15s ease'
										bg='#121211'
										color='#8F8F8F'
										fontSize='20px'
										width='272px'
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
													text={"Add An Owner"}
													to={"/add-owner"}
													justifyContent='flex-end'
													alignItems='flex-start'
												/>

												<NavigationLinkDrawer
													icon={MdOutlinePets}
													text={"Add A Pet"}
													to={"/add-pet"}
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
									<Link to={"/edit-profile"}>
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
						</Flex>
					</DrawerBody>

					<DrawerFooter color='#8F8F8F'>® Modern Vet Clinic</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	);
}
