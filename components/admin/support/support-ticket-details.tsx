"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetSupportTicketById from "@/hooks/query/useGetSupportTicketById";
import { formatDateReadable, getStatusColor } from "@/lib/helper";
import { ArrowLeft, Clock, FileText, Image, MessageSquare, User, UserCheck } from "lucide-react";
import Link from "next/link";

type Attachment = {
  id: string;
  supportId: string;
  imagePath: string | null;
};

export default function SupportTicketDetails({ ticketId }: { ticketId: string }) {
  const { data, isPending, error, isError, refetch } = useGetSupportTicketById({ ticketId });

  if (isPending) {
    return <LoadingSpinner message="Loading support ticket details..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Error Loading Support Ticket"
        message={error?.message || "There was an error loading the support ticket data. Please try again."}
        onRetry={() => refetch()}
        retryText="Try Again"
      />
    );
  }

  const supportTicket = data?.data?.data;


  const hasAttachments = supportTicket?.imagepath && supportTicket.imagepath.length > 0 && supportTicket.imagepath.some((img: Attachment) => img.imagePath);

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard/support">
            <Button variant="ghost" className="mb-4 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Support Tickets
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {supportTicket?.ticketTitle || "Support Ticket"}
              </h1>
              <p className="text-gray-600 mt-1">Ticket ID: {supportTicket?.id}</p>
            </div>
            <Badge variant="outline" className={getStatusColor(supportTicket?.status)}>
              {supportTicket?.status || "Unknown"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Information */}
            <Card className="shadow-none border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Ticket Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {supportTicket?.description || "No description provided"}
                  </p>
                </div>

                {supportTicket?.ticketType && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Ticket Type</h4>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      {supportTicket.ticketType}
                    </Badge>
                  </div>
                )}

                {supportTicket?.remarks && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Remarks</h4>
                    <p className="text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      {supportTicket.remarks}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attachments */}
            {hasAttachments && (
              <Card className="shadow-none border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" aria-hidden="true" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {supportTicket?.imagepath?.map((attachment: Attachment, index: number) => (
                      attachment.imagePath && (
                        <div key={attachment.id} className="border border-gray-200 rounded-lg p-4 text-center">
                          <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" aria-hidden="true" />
                          <p className="text-sm text-gray-600">Attachment {index + 1}</p>
                          <a
                            href={attachment.imagePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View File
                          </a>
                        </div>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            <Card className="shadow-none border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comments & Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No comments yet</p>
                  <Button className="mt-4" variant="outline">
                    Add Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Information */}
            <Card className="shadow-none border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-lg font-medium">
                    {supportTicket?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{supportTicket?.name}</h4>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      {supportTicket?.userType}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>User ID: {supportTicket?.userId}</p>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Information */}
            <Card className="shadow-none border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportTicket?.assignToName ? (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Assigned To</h4>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {supportTicket.assignToName}
                    </Badge>
                    {supportTicket.assignToId && (
                      <p className="text-sm text-gray-600 mt-1">ID: {supportTicket.assignToId}</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <UserCheck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-gray-500">Unassigned</p>
                    <Button className="mt-2" variant="outline" size="sm">
                      Assign Ticket
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-none border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Ticket Created</p>
                      <p className="text-sm text-gray-600">
                        {supportTicket?.raiseDate || formatDateReadable(supportTicket?.createAt)}
                      </p>
                    </div>
                  </div>

                  {supportTicket?.updateAt && supportTicket.updateAt !== supportTicket.createAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Last Updated</p>
                        <p className="text-sm text-gray-600">
                          {formatDateReadable(supportTicket.updateAt)}
                        </p>
                      </div>
                    </div>
                  )}

                  {supportTicket?.closingDate && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Ticket Closed</p>
                        <p className="text-sm text-gray-600">
                          {formatDateReadable(supportTicket.closingDate)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-none border-none" >
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Comment
                </Button>
                <Button className="w-full" variant="outline">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Assign Ticket
                </Button>
                {supportTicket?.status === "OPEN" && (
                  <Button className="w-full" variant="destructive">
                    Close Ticket
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}